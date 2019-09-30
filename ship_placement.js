//give every square event listener to place ship.
//when a square is clicked, remove all event listeners
//give new event listener to possible end points of ships
//give new event listener to original coord to back out
//if ship is placed it will log coords in array delivered to player.obj
//if backed out it will reinstate previous event listeners to place ship.

//event listner - place ship 1
//event listner - place ship 2
const ship_list = {
    'carrier':5,
    'battleship':4,
    'cruiser':3,
    'submarine':3,
    'destroyer':2,
};
const ship_loc = [
    [],
    [],
    [],
    [],
    [],
];
let shipnum = 0;

const potential_path = [];
function click1(coords, step) {
    // let ship = ship_list.keys[step];
    //console.log(ship_list.keys[step]);
	var n=0,ship_key = "";
	
	for (var key in ship_list) {
		if (ship_list.hasOwnProperty(key)) {
			if(n==step){
				//console.log(key + " -> " + ship_list[key]);
				ship_key = ship_list[key];
			}
			n++;
		}
	}
    const x = Number(coords.charAt(coords.length-3));
    const y = Number(coords.charAt(coords.length-1));
    const ship_length = ship_list[ship_key]-1;
	
    if( x - ship_length >= 0) {
        if (checkPath(x, y, (x-ship_length), y)) {
            potential_path.push(`${x-ship_length}${y}`);
        }
    }
    if( x + ship_length <= 9) {
        if (checkPath(x, y, (x+ship_length), y)) {
            potential_path.push(`${x+ship_length}${y}`);
        }
    }
    if( y - ship_length >= 0) {
        if (checkPath(x, y, x, (y-ship_length))) {
            potential_path.push(`${x}${y-ship_length}`);
        }
    }
    if( y + ship_length <= 9) {
        if (checkPath(x, y, x, (y+ship_length))) {
            potential_path.push(`${x}${y+ship_length}`);
        }
    }
    function checkPath(x, y, tox, toy) {
        const check_locs = [];
        let goodPath = true;
        if( tox > x ) {
            for( var i = tox ; i >= x ; i-- ) {
                check_locs.push(`${i}${y}`);
            }
        } else if ( tox < x ) {
            for( var i = tox ; i <= x ; i++ ) {
                check_locs.push(`${i}${y}`);
            }
        }
        if( toy > y ) {
            for( var i = toy ; i >= y ; i-- ) {
                check_locs.push(`${x}${i}`);
            }
        } else if ( toy < y) {
            for( var i = toy ; i <= y ; i++ ) {
                check_locs.push(`${x}${i}`);
            }
        }
        ship_loc.forEach(ship => {
            ship.forEach(loc => {
                check_locs.forEach(spot => {
                    if (spot == loc) {
                        goodPath = false;
                    }
                })
            });
        });
        return goodPath;
    }
    const origin = document.querySelector('#player-'+x+'x'+y);
	damageLocations.push(parseInt(origin.getAttribute("data-position")));
	placeShip = false;
    renderBoard('player');
	placeShips();

    //origin.classList.add('enemy-damaged');
	
    potential_path.forEach(path => {
        document.getElementById('player-'+path[0]+"x"+path[1]).classList.add('enemy-damaged');
    });
    origin.addEventListener('click', (e) => {
        if (confirm('Do you wish to remove this ship placement?')) {
            renderBoard('player');
            placeShips();
        }
    });
    potential_path.forEach(path => {
        document.getElementById('player-'+path[0]+"x"+path[1])
        document.getElementById('player-'+path[0]+"x"+path[1]).addEventListener('click', (e) => {
            if (confirm('Do you wish to place a ship here?')) {
                placeShip(origin, path);
                console.log(ship_loc);
                renderBoard('player');
            }
        });
    });

    function placeShip(origin, path) {
        const x = origin[0];
        const y = origin[1];
        const tox = path[0];
        const toy = path[1];
        if( tox > x ) {
            for( var i = tox ; i >= x ; i-- ) {
                ship_loc[shipnum].push(i+""+y);
            }
        } else if ( tox < x ) {
            for( var i = tox ; i <= x ; i++ ) {
                ship_loc[shipnum].push(i+""+y);
            }
        }
        if( toy > y ) {
            for( var i = toy ; i >= y ; i-- ) {
                ship_loc[shipnum].push(x+""+i);
            }
        } else if ( toy < y) {
            for( var i = toy ; i <= y ; i++ ) {
                ship_loc[shipnum].push(x+""+i);
            }
        }
    }
}


function placeShips() {
    let step = 0;
    let allShips = document.querySelectorAll('.player');
    allShips.forEach(ship => {
        ship.addEventListener('click', (e) => {
            click1(ship.id, step);
        });
    });
}

if ( placeShips ) {
    placeShips();
} 
