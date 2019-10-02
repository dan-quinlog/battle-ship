// SQUARES: "target" - for generic target board squares, "player" for generic empty player board squares, "ship" for player squares that have a ship, "damage" for player squares that have taken enemy damage, "damaged-ship" for player ships that have taken damage --- overwrites damage
// "enemy-damaged" for enemy squares damaged, "enemy-ship" for enemy ship squares damaged


const ship_list = {
    'carrier':5,
    'battleship':4,
    'cruiser':3,
    'submarine':3,
    'destroyer':2,
};


var set_ships = [],current_ship_to_set = 0,current_ship_name="";
let player1, player2;
// CURRENT TURN PLAYER VARIABLES
var selected_List = [];
// var shipLocations = [];//[2,3,4,10,20,30,50,60,70,80,23,33,43,53,63,77,78];
// var damageLocations = [];//50, 21, 99, 43, 35, 49,
// var enemyShipLocations = [];//[2,3,4,10,20,30,50,60,70,80,23,33,43,53,63,77,78];
// var targetLocations = [];//3, 14, 28, 49, 69, 73, 34
var rotateship = "v";

class Player {
	constructor(name = 'ai') {
		this.name = name;
		this.shipLocations = [];
		this.targetLocations = [];
	}
	pushShipLocations(el) {
		this.shipLocations.push(el);
	}
	getShipLocations() {
		return this.shipLocations;
	}
	includesShipLocations(el) {
		return this.shipLocations.includes(el);
	}
	pushTargetLocations(el) {
		this.targetLocations.push(el);
	}
	includesTargetLocations(el) {
		return this.targetLocations.includes(el)
	}
}

function wipeBoard(){
	const remove_tiles = document.querySelectorAll('.player, .target');
	console.log(remove_tiles);
	for (i = 0 ; i < remove_tiles.length ; i++) {
		remove_tiles[i].remove();
	}
}

function renderBoard(boardName, activePlayer = player1, passivePlayer = player2) {
	const playerBoard = document.getElementById('player-board');
	const targetBoard = document.getElementById('target-board');
	if (boardName == "player") {
		render(playerBoard);
	} else {
		render(playerBoard);
		render(targetBoard);
	}
	function render(boardToRender){
		const board = boardToRender.classList.contains('player-board') ? 'player' : 'target';
		var x = 0;
		while (boardToRender.firstChild) {
			boardToRender.removeChild(boardToRender.firstChild);
		}
		nthChild = 0;
		while (x < 10) {
			var y = 0;
			while (y < 10) {
				let newSquare = document.createElement("span");
				newSquare.id = `${board}-${x}x${y}`;
				newSquare.classList.add(board);
				newSquare.setAttribute("data-position",nthChild);
				boardToRender.appendChild(newSquare);
			
				if (boardToRender.classList.contains("player-board")) {
					// Iterate over board and apply markers to current player squares
					if (activePlayer.includesShipLocations(nthChild)) {
						// alert("Found you at" + nthChild + " in " + shipLoc);
						newSquare.classList.add("ship");
					}
					if (passivePlayer.includesTargetLocations(nthChild)) {
						if(newSquare.classList.contains("ship")) {
							newSquare.classList.add("damaged-ship");
						} else {
							newSquare.classList.add("damage");
						}
					}
				} else {
					// Iterate over board and apply markets and event listeners to enemy player squares
					if (passivePlayer.includesShipLocations(nthChild)) {
						// alert("Found you at" + nthChild + " in " + shipLoc);
						newSquare.classList.add("enemyLoc");
					}
					if (activePlayer.includesTargetLocations(nthChild)) {
						if(newSquare.classList.contains("enemyLoc")) {
							newSquare.classList.add("enemy-ship");
						} else {
							newSquare.classList.add("enemy-damaged");
						}
					}
				}
				nthChild++;
				y++;
			}
			x++;
		}
	}
}


function getSquareXY(squareID) {
    // Parse span ID; returns an array of two coordinates: [x,y]
	let coordinateString = squareID.substring(squareID.indexOf("-") + 1);
	let coordinate = coordinateString.replace("x", "");
    return coordinate; 
}

function getTargetSquareByPos(x, y) {
    // pass in an X and Y to grab the appropriate square in the target grid by reference
    targetIDString = `target-${x}x${y}`;
    return document.getElementById(targetIDString);
}

function addListener(activePlayer, passivePlayer) {
	let allTargets = document.querySelectorAll('.target');
    allTargets.forEach(target => {
		if (!activePlayer.includesTargetLocations(parseInt(getSquareXY(target.id)))) {
			target.addEventListener('click', (e) => {
				targetHit(target.id, activePlayer, passivePlayer);
			});
		}
    });
}

function saveShips(activePlayer, playerNumber){
	document.querySelectorAll('.shipn').forEach(ship => {
		activePlayer.pushShipLocations(parseInt(ship.getAttribute("data-position")));
		ship.classList.remove("shipn");
	});
	current_ship_to_set = 0;
	set_ships = [];
	current_ship_name = "";
	document.getElementById('saveShips').remove();
	document.getElementById('rotateship').remove();
	if (playerNumber == 1){
		player2ShipPlacement();
	} else {
		gameStart();
	}
}

function placeShips(activePlayer, playerNumber) {	
	

	const saveShipButton = document.createElement('button');
	saveShipButton.classList.add('removed');
	saveShipButton.id = ('saveShips');
	saveShipButton.innerText = 'Save Ships';
	document.getElementById('ship-button').appendChild(saveShipButton);

	const rotateShipButton = document.createElement('button');
	rotateShipButton.id = ('rotateship');
	rotateShipButton.innerText = 'Rotate Ship';
	document.getElementById('ship-button').appendChild(rotateShipButton);

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
						document.getElementById('saveShips').classList.remove('removed');
						document.getElementById('rotateship').classList.add('removed');
					}
				}
        });
	});
	document.getElementById("saveShips").addEventListener("click",function(){
		saveShips(activePlayer, playerNumber);
	});
	document.getElementById("rotateship").addEventListener("click",function(){
		rotateship = rotateship == 'v' ? "h" : "v";
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
	document.getElementById('ship-content').innerHTML = ship_html;
	if(ship_html){
		let allShips_list = document.querySelectorAll('.setShip');
		allShips_list.forEach(ship => {
			ship.addEventListener('click', (e) => {
				place_ship_list(ship.getAttribute("data-name"));
			});
		});
	}
}
function placePlayerShip(coords) {
    if(current_ship_to_set > 0){
		var n=0,ship_key = "";
		const x = Number(coords.charAt(coords.length-3));
		const y = Number(coords.charAt(coords.length-1));
		document.querySelectorAll('.shipt').forEach(ship => {
			ship.classList.remove("shipt");
		});
		if(rotateship == "v"){
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
		}else{
			if((y+(current_ship_to_set - 1)) <= 9){
				
				for(var i=y; i<=(y+(current_ship_to_set - 1)); i++){
					if((document.querySelector('#player-'+x+'x'+i).getAttribute("class")).indexOf("shipn") > -1){
						return false;
					}
				}
				
				for(var i=y; i<=(y+(current_ship_to_set - 1)); i++){
					document.querySelector('#player-'+x+'x'+i).classList.add("shipt");
				}
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
		if(rotateship == "v"){
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
		}else{
			if((y+(current_ship_to_set - 1)) <= 9){
				
				for(var i=y; i<=(y+(current_ship_to_set - 1)); i++){
					if((document.querySelector('#target-'+x+'x'+i).getAttribute("class")).indexOf("shipn") > -1){
						return false;
					}
				}
				
				for(var i=y; i<=(y+(current_ship_to_set - 1)); i++){
					document.querySelector('#target-'+x+'x'+i).classList.add("shipt");
				}
			}
		}
	}
	
}

function targetHit(coords, activePlayer, passivePlayer) {
	const x = Number(coords.charAt(coords.length-3));
	const y = Number(coords.charAt(coords.length-1));
	const origin2 = document.querySelector('#target-'+x+'x'+y);
	activePlayer.pushTargetLocations(parseInt(origin2.getAttribute("data-position")));
	renderBoard('game', activePlayer, passivePlayer);
	addListener(activePlayer, passivePlayer);
	setTimeout(function() {
		alert(`You ${passivePlayer.includesShipLocations(parseInt(origin2.getAttribute("data-position"))) ? 'hit' : 'missed'} the opponent`);
		nextTurn(activePlayer, passivePlayer);
	});

}

function gameShipPlacement() {
	player1 = new Player('dan');
	player2 = new Player('stan');
	document.getElementById('start-game').classList.add('removed');
	document.getElementById('game-wrapper').classList.remove('removed');
	renderBoard("player", player1, player2);
	place_ship_list('');
	placeShips(player1, 1);
}

function player2ShipPlacement() {
	renderBoard("player", player2, player1);
	place_ship_list('');
	placeShips(player2, 2);
}

function gameStart() {
	wipeBoard();
	setTimeout(function() {
		alert(`${player1.name} turn, click okay to continue`);
		document.getElementById('target-board').classList.remove('removed');
		renderBoard("game", player1, player2);
		addListener(player1, player2);

	}, 500);
}

function nextTurn(activePlayer, passivePlayer) {
	[activePlayer, passivePlayer] = [passivePlayer, activePlayer];
	wipeBoard();
	setTimeout(function() {
		alert(`${activePlayer.name} turn, click okay to continue`)
		renderBoard("game", activePlayer, passivePlayer);
		addListener(activePlayer, passivePlayer);
	}, 500);
}


document.getElementById('start-game').addEventListener('click', (e) => {//game start
	gameShipPlacement()
});