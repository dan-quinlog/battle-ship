// SQUARES: "target" - for generic target board squares, "player" for generic empty player board squares, "ship" for player squares that have a ship, "damage" for player squares that have taken enemy damage, "damaged-ship" for player ships that have taken damage --- overwrites damage
// "enemy-damaged" for enemy squares damaged, "enemy-ship" for enemy ship squares damaged

var set_ships = [],
  current_ship_to_set = 0,
  current_ship_name = "";
var player1, player2;
var selected_List = [];
var rotateship = "v";
const ship_list = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2
};

class Player {
  constructor(name = "ai") {
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
    return this.targetLocations.includes(el);
  }
}

function wipeBoard() {
  const remove_tiles = document.querySelectorAll(".player, .target");
  for (i = 0; i < remove_tiles.length; i++) {
    remove_tiles[i].remove();
  }
}

function renderBoard(boardName, activePlayer, passivePlayer) {
  const playerBoard = document.getElementById("player-board");
  const targetBoard = document.getElementById("target-board");
  if (boardName == "player") {
    render(playerBoard);
  } else {
    // render(playerBoard);
    render(targetBoard);
    document.getElementById('player-board').classList.add('removed');
  }
  function render(boardToRender) {
    const board = boardToRender.classList.contains("player-board")
      ? "player"
      : "target";
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
        newSquare.setAttribute("data-position", nthChild);
        boardToRender.appendChild(newSquare);

        if (boardToRender.classList.contains("player-board")) {
          // Iterate over board and apply markers to current player squares
          if (activePlayer.includesShipLocations(nthChild)) {
            // alert("Found you at" + nthChild + " in " + shipLoc);
            newSquare.classList.add("ship");
          }
          if (passivePlayer.includesTargetLocations(nthChild)) {
            if (newSquare.classList.contains("ship")) {
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
            if (newSquare.classList.contains("enemyLoc")) {
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
  let allTargets = document.querySelectorAll(".target");
  allTargets.forEach(target => {
    if (
      !activePlayer.includesTargetLocations(parseInt(getSquareXY(target.id)))
    ) {
      target.addEventListener("click", e => {
        targetHit(target.id, activePlayer, passivePlayer);
      });
    }
  });
}

function place_ship_step(activePlayer, passivePlayer) {
  renderBoard("player", activePlayer, passivePlayer);
  place_ship_list("");
  document.getElementById(
    "player-name-board"
  ).innerText = `${activePlayer.name} click here to begin placing ships`;
  document
    .getElementById("player-name-board")
    .classList.add("player-name-board");
  document.getElementById("player-name-board").addEventListener("click", e => {
    const name_board = document.getElementById("player-name-board");
    document.getElementById("game-wrapper").removeChild(name_board);
    const new_board = document.createElement("div");
    new_board.id = "player-name-board";
    document
      .getElementById("game-wrapper")
      .insertBefore(
        new_board,
        document.getElementById("game-wrapper").firstChild
      );
    placeShips(activePlayer, passivePlayer);
  });
}

function placeShips(activePlayer, passivePlayer) {
  const saveShipButton = document.createElement("button");
  saveShipButton.classList.add("removed");
  saveShipButton.id = "saveShips";
  saveShipButton.innerText = "Save Ships";
  document.getElementById("ship-button").appendChild(saveShipButton);

  const rotateShipButton = document.createElement("button");
  rotateShipButton.id = "rotateship";
  rotateShipButton.innerText = "Rotate Ship";
  document.getElementById("ship-button").appendChild(rotateShipButton);

  let allShips = document.querySelectorAll(".player");
  allShips.forEach(ship => {
    ship.addEventListener("mouseover", e => {
      placePlayerShip(ship.id);
    });
    ship.addEventListener("click", e => {
      if (document.querySelectorAll(".shipt").length > 0) {
        current_ship_to_set = 0;
        set_ships.push(current_ship_name);
        document.querySelectorAll(".shipt").forEach(ship => {
          ship.classList.add("shipn");
        });
        current_ship_name = "";
        if (document.querySelectorAll(".setShip").length < 1) {
          document.getElementById("saveShips").classList.remove("removed");
          document.getElementById("rotateship").classList.add("removed");
        }
      }
    });
  });
  document.getElementById("saveShips").addEventListener("click", function() {
    saveShips(activePlayer, passivePlayer);
  });
  document.getElementById("rotateship").addEventListener("click", function() {
    rotateship = rotateship == "v" ? "h" : "v";
  });
}
function saveShips(activePlayer, passivePlayer) {
  document.querySelectorAll(".shipn").forEach(ship => {
    activePlayer.pushShipLocations(
      parseInt(ship.getAttribute("data-position"))
    );
    ship.classList.remove("shipn");
  });
  current_ship_to_set = 0;
  set_ships = [];
  current_ship_name = "";
  document.getElementById("saveShips").remove();
  document.getElementById("rotateship").remove();
  const place_more_ships = passivePlayer.getShipLocations();
  if (place_more_ships.length > 0) {
    gameStart();
  } else {
    place_ship_step(passivePlayer, activePlayer);
  }
}
function place_ship_list(a) {
  var ship_html = "";
  for (ship in ship_list) {
    if (a != ship && !set_ships.includes(ship)) {
      ship_html +=
        "<div class='setShip' data-name='" +
        ship +
        "'>" +
        ship +
        " " +
        ship_list[ship] +
        "</div>";
    } else {
      if (a != "" && !set_ships.includes(ship)) {
        current_ship_to_set = parseInt(ship_list[ship]);
        current_ship_name = ship;
      }
    }
  }
  document.getElementById("ship-content").innerHTML = ship_html;
  if (ship_html) {
    let allShips_list = document.querySelectorAll(".setShip");
    allShips_list.forEach(ship => {
      ship.addEventListener("click", e => {
        place_ship_list(ship.getAttribute("data-name"));
      });
    });
  }
}
function placePlayerShip(coords) {
  if (current_ship_to_set > 0) {
    var n = 0,
      ship_key = "";
    const x = Number(coords.charAt(coords.length - 3));
    const y = Number(coords.charAt(coords.length - 1));
    document.querySelectorAll(".shipt").forEach(ship => {
      ship.classList.remove("shipt");
    });
    if (rotateship == "v") {
      if (x + (current_ship_to_set - 1) <= 9) {
        for (var i = x; i <= x + (current_ship_to_set - 1); i++) {
          if (
            document
              .querySelector("#player-" + i + "x" + y)
              .getAttribute("class")
              .indexOf("shipn") > -1
          ) {
            return false;
          }
        }

        for (var i = x; i <= x + (current_ship_to_set - 1); i++) {
          document
            .querySelector("#player-" + i + "x" + y)
            .classList.add("shipt");
        }
      }
    } else {
      if (y + (current_ship_to_set - 1) <= 9) {
        for (var i = y; i <= y + (current_ship_to_set - 1); i++) {
          if (
            document
              .querySelector("#player-" + x + "x" + i)
              .getAttribute("class")
              .indexOf("shipn") > -1
          ) {
            return false;
          }
        }

        for (var i = y; i <= y + (current_ship_to_set - 1); i++) {
          document
            .querySelector("#player-" + x + "x" + i)
            .classList.add("shipt");
        }
      }
    }
  }
}
function placeTargetShip(coords) {
  if (current_ship_to_set > 0) {
    var n = 0,
      ship_key = "";
    const x = Number(coords.charAt(coords.length - 3));
    const y = Number(coords.charAt(coords.length - 1));
    document.querySelectorAll(".shipt").forEach(ship => {
      ship.classList.remove("shipt");
    });
    if (rotateship == "v") {
      if (x + (current_ship_to_set - 1) <= 9) {
        for (var i = x; i <= x + (current_ship_to_set - 1); i++) {
          if (
            document
              .querySelector("#target-" + i + "x" + y)
              .getAttribute("class")
              .indexOf("shipn") > -1
          ) {
            return false;
          }
        }

        for (var i = x; i <= x + (current_ship_to_set - 1); i++) {
          document
            .querySelector("#target-" + i + "x" + y)
            .classList.add("shipt");
        }
      }
    } else {
      if (y + (current_ship_to_set - 1) <= 9) {
        for (var i = y; i <= y + (current_ship_to_set - 1); i++) {
          if (
            document
              .querySelector("#target-" + x + "x" + i)
              .getAttribute("class")
              .indexOf("shipn") > -1
          ) {
            return false;
          }
        }

        for (var i = y; i <= y + (current_ship_to_set - 1); i++) {
          document
            .querySelector("#target-" + x + "x" + i)
            .classList.add("shipt");
        }
      }
    }
  }
}

function targetHit(coords, activePlayer, passivePlayer) {
  const x = Number(coords.charAt(coords.length - 3));
  const y = Number(coords.charAt(coords.length - 1));
  const origin2 = document.querySelector("#target-" + x + "x" + y);
  activePlayer.pushTargetLocations(
    parseInt(origin2.getAttribute("data-position"))
  );
  renderBoard("game", activePlayer, passivePlayer);
  addListener(activePlayer, passivePlayer);
  if (winCondition(activePlayer, passivePlayer)) {
    document.getElementById(
      "player-name-board"
    ).innerText = `Congrats ${activePlayer.name} you won!`;
    document
      .getElementById("player-name-board")
      .classList.add("player-name-board");
    document
      .getElementById("player-name-board")
      .addEventListener("click", e => {
        const name_board = document.getElementById("player-name-board");
        document.getElementById("game-wrapper").removeChild(name_board);
        const new_board = document.createElement("div");
        new_board.id = "player-name-board";
        document
          .getElementById("game-wrapper")
          .insertBefore(
            new_board,
            document.getElementById("game-wrapper").firstChild
          );
        restartGame();
      });
  } else {
    document.getElementById("player-name-board").innerText = `You ${
      passivePlayer.includesShipLocations(
        parseInt(origin2.getAttribute("data-position"))
      )
        ? "hit"
        : "missed"
    } the opponent`;
    document
      .getElementById("player-name-board")
      .classList.add("player-name-board");
    document
      .getElementById("player-name-board")
      .addEventListener("click", e => {
        const name_board = document.getElementById("player-name-board");
        document.getElementById("game-wrapper").removeChild(name_board);
        const new_board = document.createElement("div");
        new_board.id = "player-name-board";
        document
          .getElementById("game-wrapper")
          .insertBefore(
            new_board,
            document.getElementById("game-wrapper").firstChild
          );
        nextTurn(activePlayer, passivePlayer);
      });
  }
}

function gameStart() {
  wipeBoard();
  document.getElementById(
    "player-name-board"
  ).innerText = `${player1.name} turn, click okay to continue`;
  document
    .getElementById("player-name-board")
    .classList.add("player-name-board");
  document.getElementById("player-name-board").addEventListener("click", e => {
    const name_board = document.getElementById("player-name-board");
    document.getElementById("game-wrapper").removeChild(name_board);
    const new_board = document.createElement("div");
    new_board.id = "player-name-board";
    document
      .getElementById("game-wrapper")
      .insertBefore(
        new_board,
        document.getElementById("game-wrapper").firstChild
      );
    document.getElementById("target-board").classList.remove("removed");
    renderBoard("game", player1, player2);
    addListener(player1, player2);
  });
}

function nextTurn(activePlayer, passivePlayer) {
  [activePlayer, passivePlayer] = [passivePlayer, activePlayer];
  wipeBoard();

  document.getElementById(
    "player-name-board"
  ).innerText = `${activePlayer.name} turn, click okay to continue`;
  document
    .getElementById("player-name-board")
    .classList.add("player-name-board");
  document.getElementById("player-name-board").addEventListener("click", e => {
    const name_board = document.getElementById("player-name-board");
    document.getElementById("game-wrapper").removeChild(name_board);
    const new_board = document.createElement("div");
    new_board.id = "player-name-board";
    document
      .getElementById("game-wrapper")
      .insertBefore(
        new_board,
        document.getElementById("game-wrapper").firstChild
      );
    renderBoard("game", activePlayer, passivePlayer);
    addListener(activePlayer, passivePlayer);
  });
}

function winCondition(activePlayer, passivePlayer) {
  let gamewon = true;
  const targetShips = passivePlayer.getShipLocations();
  targetShips.forEach(ship => {
    if (!activePlayer.includesTargetLocations(ship)) {
      gamewon = false;
    }
  });
  return gamewon;
}

function winGame(activePlayer, passivePlayer) {
  activePlayer.targetLocations = passivePlayer.shipLocations;
}

document.getElementById("start-game").addEventListener("click", e => {
  //game start
  player1 = new Player(
    document.getElementById("player1name").value !== ""
      ? document.getElementById("player1name").value
      : "dan"
  );
  player2 = new Player(
    document.getElementById("player2name").value !== ""
      ? document.getElementById("player2name").value
      : "stan"
  );
  startGamePlaceShips(player1, player2);
});

function startGamePlaceShips(activePlayer, passivePlayer) {
  if (!document.getElementById("game-menu").classList.contains("removed")) {
    document.getElementById("game-menu").classList.add("removed");
  }
  if (document.getElementById("game-wrapper").classList.contains("removed")) {
    document.getElementById("game-wrapper").classList.remove("removed");
  }
  set_ships = [];
  current_ship_to_set = 0;
  current_ship_name = "";
  selected_List = [];
  rotateship = "v";
  renderBoard("player", activePlayer, passivePlayer);
  place_ship_list("");
  place_ship_step(activePlayer, passivePlayer);
}

function restartGame() {
  document.location.reload()
}
