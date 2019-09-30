// SQUARES: "target" - for generic target board squares, "player" for generic empty player board squares, "ship" for player squares that have a ship, "damage" for player squares that have taken enemy damage, "damaged-ship" for player ships that have taken damage --- overwrites damage
// "enemy-damaged" for enemy squares damaged, "enemy-ship" for enemy ship squares damaged



const targetBoard = document.querySelector('.target-board');
const playerBoard = document.querySelector('.player-board');

var placeShip = false;

// CURRENT TURN PLAYER VARIABLES
var shipLocations = [[2,3,4],[10,20,30], [50,60,70,80], [23,33,43,53,63], [77,78]];
var damageLocations = [];//50, 21, 99, 43, 35, 49,
var enemyShipLocations = [[2,3,4],[10,20,30], [50,60,70,80], [23,33,43,53,63], [77,78]];
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
                    shipLocations.forEach (shipLoc => {
                        if (shipLoc.includes(nthChild)) {
                            // alert("Found you at" + nthChild + " in " + shipLoc);
                            newSquare.classList.add("ship");
                        }
                    })
                    if (damageLocations.includes(nthChild)) {
                        if(newSquare.classList.contains("ship")) {
                            newSquare.classList.add("damaged-ship");
                        } else {
                            newSquare.classList.add("damage");
                        }
                    }
                } else {
                    // Iterate over board and apply markets and event listeners to enemy player squares
                    enemyShipLocations.forEach (eShipLoc => {
                        if (eShipLoc.includes(nthChild)) {
                            // alert("Found you at" + nthChild + " in " + shipLoc);
                            newSquare.classList.add("enemyLoc");
                        }
                    })
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
	addListener();

}
addListener();
console.log() 