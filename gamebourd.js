// SQUARES: "target" - for generic target board squares, "player" for generic empty player board squares, "ship" for player squares that have a ship, "damage" for player squares that have taken enemy damage, "damaged-ship" for player ships that have taken damage --- overwrites damage
// "enemy-damaged" for enemy squares damaged, "enemy-ship" for enemy ship squares damaged


const ship_list = {
    'carrier':5,
    'battleship':4,
    'cruiser':3,
    'submarine':3,
    'destroyer':2,
};

const targetBoard = document.querySelector('.target-board');
const playerBoard = document.querySelector('.player-board');

var placeShip = false;
var setPlayer = 1;
var set_ships = [],current_ship_to_set = 0,current_ship_name="";
// CURRENT TURN PLAYER VARIABLES
var selected_List = [];
var shipLocations = [];//[2,3,4,10,20,30,50,60,70,80,23,33,43,53,63,77,78];
var damageLocations = [];//50, 21, 99, 43, 35, 49,
var enemyShipLocations = [];//[2,3,4,10,20,30,50,60,70,80,23,33,43,53,63,77,78];
var targetLocations = [];//3, 14, 28, 49, 69, 73, 34

function renderBoard(boardName) {
    var x = 0;
    const boardToRender = boardName === "target" ? targetBoard : playerBoard;
    while (boardToRender.firstChild) {
        boardToRender.removeChild(boardToRender.firstChild);
    }
    nthChild = 0;
    while (x < 10) {
        var y = 0;
        while (y < 10) {
            let newSquare = document.createElement("span");
            newSquare.id = `${boardName}-${x}x${y}`;
            newSquare.classList.add(boardName);
            newSquare.setAttribute("data-position",nthChild);
            boardToRender.appendChild(newSquare);
            if (placeShip) {
                // DAN'S CODE GOES HERE
            } else {
                // Iterate over board and apply markers to current player squares
                if (boardName === "player") {
					if (shipLocations.includes(nthChild)) {
						// alert("Found you at" + nthChild + " in " + shipLoc);
						newSquare.classList.add("ship");
					}
                    if (damageLocations.includes(nthChild)) {
                        if(newSquare.classList.contains("ship")) {
                            newSquare.classList.add("damaged-ship");
                        } else {
                            newSquare.classList.add("damage");
                        }
                    }
                } else {
                    // Iterate over board and apply markets and event listeners to enemy player squares
                    if (enemyShipLocations.includes(nthChild)) {
						// alert("Found you at" + nthChild + " in " + shipLoc);
						newSquare.classList.add("enemyLoc");
					}
                    if (targetLocations.includes(nthChild)) {
                        if(newSquare.classList.contains("enemyLoc")) {
                            newSquare.classList.add("enemy-ship");
                        } else {
                            newSquare.classList.add("enemy-damaged");
                        }
                    }
                }
            }
            nthChild++;
            y++;
        }
        x++;
    }

}

// CALL ANYTIME BOARD MUST CHANGE
renderBoard("target");
renderBoard("player");

function getSquareXY(squareID) {
    // Parse span ID; returns an array of two coordinates: [x,y]
    let coordinateString = squareID.substring(squareID.indexOf("-") + 1);
    var coordinateArray = coordinateString.split("x");
    return coordinateArray;
}

function getTargetSquareByPos(x, y) {
    // pass in an X and Y to grab the appropriate square in the target grid by reference
    targetIDString = `target-${x}x${y}`;
    return document.getElementById(targetIDString);
}

function addListener() {
    let allShips = document.querySelectorAll('.player');
    allShips.forEach(ship => {
        ship.addEventListener('click', (e) => {
            shiptHit(ship.id);
        });
    });
    let allShips2 = document.querySelectorAll('.target');
    allShips2.forEach(ship => {
        ship.addEventListener('click', (e) => {
            targetHit(ship.id);
        });
    });
}
function saveShips(){
	if(document.getElementById("player-board").style.display  != "none"){
		
		document.querySelectorAll('.shipn').forEach(ship => {
			shipLocations.push(parseInt(ship.getAttribute("data-position")));
			ship.classList.remove("shipn");
		});
		current_ship_to_set = 0;
		set_ships = [];
		current_ship_name = "";
		document.getElementById("target-board").style.display = "grid";
		renderBoard("player");
		document.getElementById("player-board").style.display = "none";
		place_ship_list("");
	}else if(document.getElementById("target-board").style.display  != "none"){
		
		document.querySelectorAll('.shipn').forEach(ship => {
			enemyShipLocations.push(parseInt(ship.getAttribute("data-position")));
			ship.classList.remove("shipn");
		});
		place_ship_list("");
		current_ship_to_set = 0;
		set_ships = [];
		current_ship_name = "";
		document.getElementById("target-board").style.display = "grid";
		renderBoard("target");
		renderBoard("player");
		document.getElementById("player-board").style.display = "grid";
		addListener();
	}
}
function addListenerHover() {
	
    let allShips = document.querySelectorAll('.player');
    allShips.forEach(ship => {
        ship.addEventListener('mouseover', (e) => {
            placePlayerShip(ship.id);
        });
        ship.addEventListener('click', (e) => {
				if(document.querySelectorAll('.shipt').length > 0){
					current_ship_to_set = 0;
					set_ships.push(current_ship_name);
					document.querySelectorAll('.shipt').forEach(ship => {
						ship.classList.add("shipn");
					});
					current_ship_name = "";
					if(document.querySelectorAll('.setShip').length < 1){
						document.getElementById('ShipList').innerHTML = "<button onclick='saveShips()'>Save Ships</button>";
					}
				}
        });
    });
	
    document.querySelectorAll('.target').forEach(ship => {
        ship.addEventListener('mouseover', (e) => {
            placeTargetShip(ship.id);
        });
        ship.addEventListener('click', (e) => {
				if(document.querySelectorAll('.shipt').length > 0){
					current_ship_to_set = 0;
					set_ships.push(current_ship_name);
					document.querySelectorAll('.shipt').forEach(ship => {
						ship.classList.add("shipn");
					});
					current_ship_name = "";
					if(document.querySelectorAll('.setShip').length < 1){
						document.getElementById('ShipList').innerHTML = "<button onclick='saveShips()'>Save Ships</button>";
					}
				}
        });
    });
}
function place_ship_list(a){
	var ship_html = "";
	for(ship in ship_list){
		if(a != ship && !set_ships.includes(ship)){
			ship_html +="<div class='setShip' data-name='"+ship+"'>"+ship+" "+ship_list[ship]+"</div>";
		}else{
			if(a != "" && !set_ships.includes(ship)){
				current_ship_to_set = parseInt(ship_list[ship]);
				current_ship_name = ship;
			}
		}
	}
	document.getElementById('ShipList').innerHTML = ship_html;
	if(ship_html){
		let allShips_list = document.querySelectorAll('.setShip');
		allShips_list.forEach(ship => {
			ship.addEventListener('click', (e) => {
				place_ship_list(ship.getAttribute("data-name"));
			});
		});
	}
}
addListenerHover();
place_ship_list("");
function placePlayerShip(coords) {
    if(current_ship_to_set > 0){
		var n=0,ship_key = "";
		const x = Number(coords.charAt(coords.length-3));
		const y = Number(coords.charAt(coords.length-1));
		document.querySelectorAll('.shipt').forEach(ship => {
			ship.classList.remove("shipt");
		});
		if((x+(current_ship_to_set - 1)) <= 9){
			
			for(var i=x; i<=(x+(current_ship_to_set - 1)); i++){
				if((document.querySelector('#player-'+i+'x'+y).getAttribute("class")).indexOf("shipn") > -1){
					return false;
				}
			}
			
			for(var i=x; i<=(x+(current_ship_to_set - 1)); i++){
				document.querySelector('#player-'+i+'x'+y).classList.add("shipt");
			}
		}
	}
	
}
function placeTargetShip(coords) {
    if(current_ship_to_set > 0){
		var n=0,ship_key = "";
		const x = Number(coords.charAt(coords.length-3));
		const y = Number(coords.charAt(coords.length-1));
		document.querySelectorAll('.shipt').forEach(ship => {
			ship.classList.remove("shipt");
		});
		if((x+(current_ship_to_set - 1)) <= 9){
			
			for(var i=x; i<=(x+(current_ship_to_set - 1)); i++){
				if((document.querySelector('#target-'+i+'x'+y).getAttribute("class")).indexOf("shipn") > -1){
					return false;
				}
			}
			
			for(var i=x; i<=(x+(current_ship_to_set - 1)); i++){
				document.querySelector('#target-'+i+'x'+y).classList.add("shipt");
			}
		}
	}
	
}
function shiptHit(coords) {
    
	var n=0,ship_key = "";
	
	const x = Number(coords.charAt(coords.length-3));
	const y = Number(coords.charAt(coords.length-1));
	
	const origin = document.querySelector('#player-'+x+'x'+y);
		if (damageLocations.includes(parseInt(origin.getAttribute("data-position")))){
			alert('You cant hit the same place twice');
			return false;
		}
		damageLocations.push(parseInt(origin.getAttribute("data-position")));
		placeShip = false;
		renderBoard('player');
		renderBoard('target');
		addListener();
}
function targetHit(coords) {
    
	var n=0,ship_key = "";
	
	const x = Number(coords.charAt(coords.length-3));
	const y = Number(coords.charAt(coords.length-1));
	const origin2 = document.querySelector('#target-'+x+'x'+y);
		if (targetLocations.includes(parseInt(origin2.getAttribute("data-position")))){
			alert('You cant hit the same place twice');
			return false;
		}
		targetLocations.push(parseInt(origin2.getAttribute("data-position")));
		placeShip = false;
		
		renderBoard('player');
		renderBoard('target');
		addListener();

}
document.getElementById('start-game').addEventListener('click', (e) => {
	document.getElementById('start-game').style.display = "none";
	addListener();
});