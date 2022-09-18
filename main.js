/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.html":
/*!************************!*\
  !*** ./src/index.html ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = "<!DOCTYPE html>\n<html>\n\n<head>\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <title>Battleship</title>\n    <meta name=\"description\" content=\"\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n</head>\n\n<body>\n    <main class=\"main-container\">\n        <h1>Battleship</h1>\n\n        <div class=\"players-container\">\n            <div class=\"player-one-container\">\n\n            </div>\n            <div class=\"player-two-container\">\n\n            </div>\n        </div>\n\n        <div id=\"hintContainer\">\n            <p>Hint: Click on any one of your ships to relocate it</p>\n            <p>Hint: While searching for a new position for your ship, press R to rotate it</p>\n        </div>\n\n        <!-- <div class=\"help-inst\">\n            <p>Carrier</p>\n            <p>Battleship</p>\n            <p>Destroyer</p>\n            <p>Submarine</p>\n            <p>Patrol Boat</p>\n        </div> -->\n    </main>\n</body>\n\n</html>";
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ }),

/***/ "./src/css/style.css":
/*!***************************!*\
  !*** ./src/css/style.css ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/components/dom-manipulation.js":
/*!********************************************!*\
  !*** ./src/components/dom-manipulation.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPlayerGrid": () => (/* binding */ createPlayerGrid),
/* harmony export */   "placeShips": () => (/* binding */ placeShips)
/* harmony export */ });
const playerOneContainer = document.querySelector('.player-one-container');
const playerTwoContainer = document.querySelector('.player-two-container');
const contentParent = document.querySelector('.main-container');

const getPlayerContainer = (thisPlayer) => {
  let currentPlayerContainer;
  if (thisPlayer.getName() !== 'Computer') {
    currentPlayerContainer = playerOneContainer;
  } else if (thisPlayer.getName() === 'Computer') {
    currentPlayerContainer = playerTwoContainer;
  }
  return currentPlayerContainer;
};

const declareWinner = (player) => {
  let winnerCongratsText = document.createElement('div');
  winnerCongratsText.setAttribute('id', 'winnerCongrats');
  winnerCongratsText.textContent = `Congrats ${player.getName()} won the game!`;
  contentParent.appendChild(winnerCongratsText);
};

const AIAttacksDOM = (thisPlayer) => {
  console.log(thisPlayer);
  const AIAttackCoords = thisPlayer.AIAttacks();
  const dataID = `${AIAttackCoords[0]} ${AIAttackCoords[1]}`;
  const cell = playerOneContainer.querySelector(`[data-coor='${dataID}']`);
  cell.classList.remove('cell');
  // only the human's ships have id to visualize them in the board with different colors
  if (cell.hasAttribute('id')) {
    cell.classList.add('hit');
  } else {
    cell.classList.add('missed');
  }
};

const recieveAttack = (displayCell, arrayFormat, thisPlayer) => {
  displayCell.classList.remove('cell');
  const playerOneAttacks = thisPlayer.opponent.attacks(arrayFormat);
  // when we click on playerTwo's board playerTwo's opponent attacks.
  if (playerOneAttacks === undefined) {
    return false;
  } // undefined is returned when the position is already shot

  if (playerOneAttacks) {
    displayCell.classList.add('hit');
  } else {
    displayCell.classList.add('missed');
  }
  return true;

  // now it's AI's turn to attack
};

const createPlayerGrid = (player) => {
  const thisPlayer = player;
  const arrayGrid = thisPlayer.playerBoard.gameboard;
  const playerContainer = getPlayerContainer(thisPlayer);

  if (playerContainer === playerTwoContainer) {
    arrayGrid.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const displayCell = document.createElement('div');
        displayCell.classList.add('cell');
        displayCell.dataset.coor = `${rowIndex} ${cellIndex}`;
        const arrayFormat = [rowIndex, cellIndex];
        displayCell.addEventListener(
          'click',
          () => {
            if (
              thisPlayer.winner === true ||
              thisPlayer.opponent.winner === true
            ) {
              return;
            }
            if (recieveAttack(displayCell, arrayFormat, thisPlayer) !== false) {
              AIAttacksDOM(thisPlayer);
              // ^ false will only be returned if playerOne attack is undefined which means pos is already shot,
              // in which case AI doesn't attack and we wait for player to click on a tile that hasn't been shot
            }
            if (thisPlayer.winner === true) {
              declareWinner(thisPlayer);
            }
            if (thisPlayer.opponent.winner === true) {
              declareWinner(thisPlayer.opponent);
            }
          },
          false
        );
        playerContainer.appendChild(displayCell);
      });
    }); // adding eventlistener for playerTwoContainer since this is the container that the human player will be attacking
  } else {
    arrayGrid.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const displayCell = document.createElement('div');
        displayCell.classList.add('cell');
        displayCell.dataset.coor = `${rowIndex} ${cellIndex}`;
        playerContainer.appendChild(displayCell);
      });
    }); // this is the playerOneContainer
  }

  playerContainer.style.gridTemplateColumns = `repeat(${arrayGrid.length}, auto)`;
  playerContainer.style.gridTemplateRows = `repeat(${arrayGrid.length}, auto)`;
};

const addHoverEffect = (length, placeCell, direction) => {
  const shipLength = length;

  const dataID = placeCell.dataset.coor;
  if (dataID === undefined) {
    return;
  }

  let xPos = Number(dataID[0]);
  let yPos = Number(dataID[2]); // dataID[1] is empty space

  let selectedCell = playerOneContainer.querySelector(
    `[data-coor='${xPos} ${yPos}']`
  );

  for (let i = 0; i < shipLength; i++) {
    if (direction === 'ver') {
      selectedCell = playerOneContainer.querySelector(
        `[data-coor='${xPos++} ${yPos}']`
      );
    } else if (direction === 'hor') {
      selectedCell = playerOneContainer.querySelector(
        `[data-coor='${xPos} ${yPos++}']`
      );
    }

    if (selectedCell === null) {
      return;
    }

    selectedCell.classList.add('placing');
  }
};

const playerMoveShip = (shipLength, shipPlaced, player) => {
  if (player.allShots.length) {
    return;
  } // if game started // first shot was fired, then exit, player is not allowed to move ships

  let direction = 'ver';

  const changeHoverDirection = (e) => {
    if (e.key === 'r') {
      direction === 'ver' ? (direction = 'hor') : (direction = 'ver');
    }
  };

  const _placeListener = (placeCell) => {
    const target = placeCell.target;
    const ship = shipPlaced;
    if (newShipPos(target, ship, player, direction)) {
      playerOneContainer.removeEventListeners();
      document.removeEventListener('keydown', changeHoverDirection);
    }
  };

  const _hoverListener = (e) => {
    const placeCell = e.target;
    const length = shipLength;
    addHoverEffect(length, placeCell, direction);

    placeCell.addEventListener('click', _placeListener);
  };

  const removeHoverEffect = () => {
    const cells = playerOneContainer.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.classList.remove('placing');
      cell.removeEventListener('click', _placeListener);
    });
  };

  if (playerOneContainer.removeEventListeners) {
    playerOneContainer.removeEventListeners();
  }

  playerOneContainer.addEventListener('mouseover', _hoverListener);
  document.addEventListener('keydown', changeHoverDirection);

  playerOneContainer.removeEventListeners = () => {
    playerOneContainer.removeEventListener('mouseover', _hoverListener);
    removeHoverEffect();
  };

  // remove the hover effect on cells after mouseout
  playerOneContainer.addEventListener('mouseout', removeHoverEffect);
};

const removeOldShipPos = (oldShipPosArray) => {
  const positionsToRemove = oldShipPosArray;
  positionsToRemove.forEach((pos) => {
    const cell = document.querySelector(`[data-coor='${pos[0]} ${pos[1]}']`);
    cell.removeAttribute('id');
    const clone = cell.cloneNode(false);
    cell.parentNode.replaceChild(clone, cell);
  });
  // cleaning old positions of the relocated ship, removing its id and replacing it with a node clone,
  // to remove its eventListeners, not the best way of doing this
};

const newShipPos = (target, ship, player, direction) => {
  const targetCell = target.dataset.coor;
  const targetShip = ship.getShipClass();
  const pos = [Number(targetCell[0]), Number(targetCell[2])];

  const oldShipPosArray = [];

  const getShip = player.playerBoard.getShip(targetShip); // store the old ship
  const oldShipPositions = getShip.length;
  oldShipPositions.forEach((pos) => {
    oldShipPosArray.push(pos);
  });

  let newShipPos;

  if (direction === 'ver') {
    newShipPos = player.playerBoard.placeShip(targetShip, pos, 'ver');
  } else if (direction === 'hor') {
    newShipPos = player.playerBoard.placeShip(targetShip, pos, 'hor');
  }

  if (newShipPos !== false) {
    removeOldShipPos(oldShipPosArray);
    placeShips(player, getShip);

    return true;
  }
  return false;
};

const placeShips = (player, ship) => {
  const shipPlaced = ship;
  const playerContainer = getPlayerContainer(player);
  let shipName = ship.shipClass;
  const shipPositions = shipPlaced.length; // get the length of the ship // length is also array of the positions as in [3, 5] etc.
  const shipLength = shipPlaced.length.length;

  shipPositions.forEach((pos) => {
    const xPos = pos[0]; // store the first coordinate exp: [3, 5] store 3
    const yPos = pos[1]; // store the second coordinate
    const dataID = `${xPos} ${yPos}`; // store both of the coordinates into a string exp: 3 5

    const child = playerContainer.querySelector(`[data-coor='${dataID}']`); // ^ store the child div of the playerContainer with the current dataID
    child.setAttribute('id', `${shipName}`); // set the div's id with the name of the ship being placed
    child.addEventListener('click', () =>
      playerMoveShip(shipLength, shipPlaced, player)
    );
  });
  // most likely not the best way of doing this, but the only solution i can think of 😕
};




/***/ }),

/***/ "./src/components/gameboard.js":
/*!*************************************!*\
  !*** ./src/components/gameboard.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ship_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship.js */ "./src/components/ship.js");


class Gameboard {
  constructor() {
    this.gameboard = this.constructor.createGameboard();
    this.ships = [];
    this.missedShots = []; // forgot about this and didn't use it to visualize missed hits
  }

  static createGameboard() {
    const board = [];

    for (let i = 0; i < 10; i += 1) {
      board[i] = [];
      for (let j = 0; j < 10; j += 1) {
        board[i][j] = null;
      }
    }
    return board;
  }

  placeShip(s, [x, y], dir) {
    let newShip;

    const checkShipExists = this.getShip(s);
    if (!!checkShipExists) {
      newShip = checkShipExists;
    } else {
      newShip = new _ship_js__WEBPACK_IMPORTED_MODULE_0__["default"](s);
    } // if the ship we are given exists then select that ship, we are relocating it, else create a new one

    let xCoor = x;
    let yCoor = y;

    const direction = dir;
    if (direction !== 'ver' && direction !== 'hor') {
      console.log('invalid direction only "ver" or "hor"');
      return false;
    }

    let shipLength = newShip.getLength(); // gives the length of the ship, as in length of the array

    if (direction === 'ver') {
      if (yCoor < 0 || yCoor > 9) {
        console.log('invalid Y coordinates');
        return false;
      }
      if (xCoor - 1 + shipLength > 9 || xCoor < 0) {
        console.log('invalid X coordinates');
        return false;
      }
    } else if (direction === 'hor') {
      if (yCoor - 1 + shipLength > 9 || yCoor < 0) {
        console.log('invalid Y coordinates');
        return false;
      }
      if (xCoor < 0 || xCoor > 9) {
        console.log('invalid X coordinates');
        return false;
      }
    }

    const tempPositions = [];

    if (!!checkShipExists) {
      newShip.length.forEach((pos) => {
        tempPositions.push(pos);
        this.gameboard[pos[0]][pos[1]] = null;
      });
      // if the ship we are currently placing exists, meaning we are relocating it,
      // then reset its position so checkProximity doesn't check for its own position
      // and push its positions to a temp array.
    }
    // if checkPiximity returns true then we know we are placing our current ship too close to another ship, exit
    if (this.checkProximity([x, y], shipLength, direction)) {
      console.log('occupied by ship nearby (sides or top/bottom and edges)');
      // if we tempPositions has length, meaning we failed to relocate an existing ship,
      // then push that existing ship's positions back to the gameboard.
      if (tempPositions.length) {
        tempPositions.forEach((pos) => {
          this.gameboard[pos[0]][pos[1]] = newShip.getShipName();
        });
      }
      return false;
    }

    // reset ship's length since we have it saved at variable shipLength
    // and fill the length array with this ship's position
    newShip.length = [];
    while (shipLength > 0) {
      newShip.length.push([xCoor, yCoor]);
      if (direction === 'ver') {
        this.gameboard[xCoor][yCoor] = newShip.getShipName();
        xCoor += 1;
      } else if (direction === 'hor') {
        this.gameboard[xCoor][yCoor] = newShip.getShipName();
        yCoor += 1;
      }
      shipLength -= 1;
    }

    if (!checkShipExists) {
      this.ships.push(newShip);
    } // only push current ship to ships if it's a new ship
  }

  checkProximity([x, y], shipLength, direction) {
    let xCoor = x;
    let yCoor = y;
    let length = shipLength;
    let moves = [];
    if (direction === 'ver') {
      moves = [
        { x: xCoor - 1, y: yCoor },
        { x: xCoor - 1, y: yCoor - 1 },
        { x: xCoor - 1, y: yCoor + 1 },
      ];
    } else if (direction === 'hor') {
      moves = [
        { x: xCoor, y: yCoor - 1 },
        { x: xCoor - 1, y: yCoor - 1 },
        { x: xCoor + 1, y: yCoor - 1 },
      ];
    } // ^ standard positions for top part of the ship.

    while (length > 0) {
      if (direction === 'ver') {
        moves.push({ x: xCoor, y: yCoor - 1 }, { x: xCoor, y: yCoor + 1 }); // positions for sides of the ship
        moves.push({ x: xCoor, y: yCoor }); // positions for the ship itself
        xCoor += 1;
        if (length === 1) {
          moves.push(
            { x: xCoor, y: yCoor },
            { x: xCoor, y: yCoor - 1 },
            { x: xCoor, y: yCoor + 1 }
          ); // ^ positions for the bottom part of the ship.
        }
      } else if (direction === 'hor') {
        moves.push({ x: xCoor - 1, y: yCoor }, { x: xCoor + 1, y: yCoor }); // positions for sides of the ship
        moves.push({ x: xCoor, y: yCoor }); // positions for the ship itself
        yCoor += 1;
        if (length === 1) {
          moves.push(
            { x: xCoor, y: yCoor },
            { x: xCoor - 1, y: yCoor },
            { x: xCoor + 1, y: yCoor }
          ); // ^ positions for the bottom part of the ship.
        }
      }

      length -= 1;
    }

    const searchAround = moves.some((m) => {
      let { checkX } = m;
      checkX = m.x;
      let { checkY } = m;
      checkY = m.y;

      // if we are searching for out of gameboard border just skip
      if (checkX < 0 || checkX > 9 || checkY < 0 || checkY > 9) {
        return false;
      }

      if (this.gameboard[checkX][checkY] !== null) {
        console.log(
          `${this.gameboard[checkX][checkY]} ${checkX} / ${checkY} FILLED`
        );
        return true; // return true if there is a ship nearby
      }
    });

    if (searchAround) {
      return true;
    }
  }

  receiveAttack([x, y]) {
    const xCoor = x;
    const yCoor = y;
    if (xCoor > 9 || xCoor < 0 || yCoor > 9 || yCoor < 0) {
      console.log('invalid coordinates');
      return false;
    }
    const hitCoor = this.gameboard[xCoor][yCoor];

    if (hitCoor !== null) {
      let shipHit;
      if (hitCoor === 'Car') {
        shipHit = 'Carrier';
      } else if (hitCoor === 'Bat') {
        shipHit = 'Battleship';
      } else if (hitCoor === 'Des') {
        shipHit = 'Destroyer';
      } else if (hitCoor === 'Sub') {
        shipHit = 'Submarine';
      } else {
        shipHit = 'PatrolBoat';
      }

      shipHit = this.getShip(shipHit);
      let counter = 1;
      shipHit.length.some((pos) => {
        if (pos[0] === xCoor && pos[1] === yCoor) {
          return true;
        }
        counter += 1;
        return false;
      }); // ^ find which position we are hitting the ship from
      shipHit.hit(counter);
      this.gameboard[xCoor][yCoor] = 'hit'; // update gameboard to display 'hit'

      console.log(`hitting ${shipHit.shipClass} from position ${counter}`);
      return true;
    }
    this.missedShots.push([xCoor, yCoor]); // kind of forgot about this, this is not beign used
    // console.log(this.missedShots);
    console.log('hit missed');
    return false;
  }

  checkAllShipsSunk() {
    const ships = this.ships;

    const AllShipsCheck = ships.every((ship) => {
      if (ship.isSunk === true) {
        return true;
      }
      return false;
    });
    if (AllShipsCheck === true) {
      return true;
    }
    return false;
  }

  getShip(ship) {
    const allShips = this.ships;

    const findShip = (element) => element.shipClass === ship;
    const checkShipExists = allShips.find(findShip);
    if (checkShipExists === undefined) {
      // console.log('no such ship');
      return false;
    }
    return checkShipExists;
  }

  removeShip(ship) {
    const shipToBeRemoved = this.getShip(ship);
    const positionsOfTheShip = shipToBeRemoved.length;

    positionsOfTheShip.forEach((pos) => {
      this.gameboard[pos[0]][pos[1]] = null;
    });
    this.ships.splice(this.ships.indexOf(shipToBeRemoved), 1); // remove the ship
  }
}

// const gameboard = new Gameboard();
// gameboard.placeShip('Carrier', [0, 0], 'hor');
// gameboard.placeShip('Battleship', [6, 2], 'ver');
// gameboard.placeShip('Destroyer', [2, 1], 'ver');
// gameboard.placeShip('Submarine', [5, 6], 'ver');
// gameboard.placeShip('PatrolBoat', [8, 9], 'ver');

// gameboard.placeShip('Submarine', [4, 8], 'ver');

// // // gameboard.removeShip('Submarine');

// // // gameboard.receiveAttack([3, 2]);

// gameboard.gameboard.forEach((element) => {
//   console.log(element);
// });

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);


/***/ }),

/***/ "./src/components/player.js":
/*!**********************************!*\
  !*** ./src/components/player.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _gameboard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard.js */ "./src/components/gameboard.js");


class Player {
  constructor(name) {
    this.playerBoard = new _gameboard_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.opponent = null;
    this.allShots = [];
    this.name = name;
    this.winner = false;
  }

  // getTurn() {
  //   return this.opponent;
  // }

  getName() {
    return this.name;
  }

  attacks([x, y]) {
    if (this.checkAlreadyShot([x, y])) {
      return;
      // if the [x, y] position is already shot at return // exit
    } else {
      this.allShots.push([x, y]);
      const attackOpponent = this.opponent.playerBoard.receiveAttack([x, y]); // returns true if shot hit, false if it didn't
      const isAllOpponentShipsSunk =
        this.opponent.playerBoard.checkAllShipsSunk(); // returns true if all ships are sunk, false otherwise

      if (isAllOpponentShipsSunk) this.winner = true;
      return attackOpponent;
    }
  }

  checkAlreadyShot([x, y]) {
    const checkAlreadyShot = this.allShots.some((shot) => {
      if (shot[0] === x && shot[1] === y) {
        return true;
      }
      return false;
    });

    if (checkAlreadyShot === true) {
      console.log('position is already shot at');
      return true;
    }
    return false;
  }

  randomNum() {
    return Math.floor(Math.random() * 10);
  }

  randomDir() {
    const myArray = ['ver', 'hor'];
    return myArray[Math.floor(Math.random() * myArray.length)];
  }

  AIPlaceShips() {
    const placeCarrier = () => {
      this.playerBoard.placeShip(
        'Carrier',
        [this.randomNum(), this.randomNum()],
        this.randomDir()
      );
    };

    const placeBattleship = () => {
      this.playerBoard.placeShip(
        'Battleship',
        [this.randomNum(), this.randomNum()],
        this.randomDir()
      );
    };

    const placeDestroyer = () => {
      this.playerBoard.placeShip(
        'Destroyer',
        [this.randomNum(), this.randomNum()],
        this.randomDir()
      );
    };

    const placeSubmarine = () => {
      this.playerBoard.placeShip(
        'Submarine',
        [this.randomNum(), this.randomNum()],
        this.randomDir()
      );
    };

    const placePatrolBoat = () => {
      this.playerBoard.placeShip(
        'PatrolBoat',
        [this.randomNum(), this.randomNum()],
        this.randomDir()
      );
    };

    const allShips = this.playerBoard.ships;
    const shipsToAdd = [
      'Carrier',
      'Battleship',
      'Destroyer',
      'Submarine',
      'PatrolBoat',
    ];

    while (allShips.length !== 5) {
      allShips.forEach((ship) => {
        const shipName = ship.getShipClass();
        if (shipsToAdd.includes(shipName)) {
          shipsToAdd.splice(shipsToAdd.indexOf(shipName), 1); // remove the ship
        }
      });
      shipsToAdd.forEach((ship) => {
        if (ship === 'Carrier') {
          placeCarrier();
        } else if (ship === 'Battleship') {
          placeBattleship();
        } else if (ship === 'Destroyer') {
          placeDestroyer();
        } else if (ship === 'Submarine') {
          placeSubmarine();
        } else if (ship === 'PatrolBoat') {
          placePatrolBoat();
        }
      });
    }
  }

  AIAttacks() {
    const attackCoor = [this.randomNum(), this.randomNum()];
    if (this.checkAlreadyShot([attackCoor[0], attackCoor[1]])) {
      console.log('AI is gonna retry hitting');
      return this.AIAttacks(); // do AIAttacks until AI hits with available position
    } else {
      this.attacks(attackCoor);
      return attackCoor;
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);


/***/ }),

/***/ "./src/components/ship.js":
/*!********************************!*\
  !*** ./src/components/ship.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Ship {
  constructor(shipClass) {
    this.shipClass = shipClass;
    this.length = this.assignClassLength();
    this.isSunk = false;
  }

  assignClassLength() {
    if (this.shipClass === 'Carrier') {
      return [1, 2, 3, 4, 5];
    }
    if (this.shipClass === 'Battleship') {
      return [1, 2, 3, 4];
    }
    if (this.shipClass === 'Destroyer') {
      return [1, 2, 3];
    }
    if (this.shipClass === 'Submarine') {
      return [1, 2, 3];
    }
    if (this.shipClass === 'PatrolBoat') {
      return [1, 2];
    }
    return console.log('something went wrong');
  }

  getLength() {
    return this.length.length;
  }

  getShipName() {
    return this.shipClass.slice(0, 3);
  }

  getShipClass() {
    return this.shipClass;
  }

  hit(num) {
    if (this.length.length >= num && num > 0) {
      this.length[num - 1] = 'hit';
      this.sunk();
    }
  }

  sunk() {
    const checkSunk = (current) => current === 'hit';

    if (this.length.every(checkSunk)) this.isSunk = true;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css/style.css */ "./src/css/style.css");
/* harmony import */ var _index_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.html */ "./src/index.html");
/* harmony import */ var _components_player_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/player.js */ "./src/components/player.js");
/* harmony import */ var _components_dom_manipulation_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/dom-manipulation.js */ "./src/components/dom-manipulation.js");





const NewPlayer = _components_player_js__WEBPACK_IMPORTED_MODULE_2__["default"];

const playerOne = new NewPlayer('Human');
const playerAI = new NewPlayer('Computer');
playerOne.opponent = playerAI;
playerAI.opponent = playerOne;

const gameStart = {
  init() {
    (0,_components_dom_manipulation_js__WEBPACK_IMPORTED_MODULE_3__.createPlayerGrid)(playerOne);
    (0,_components_dom_manipulation_js__WEBPACK_IMPORTED_MODULE_3__.createPlayerGrid)(playerAI);

    playerAI.AIPlaceShips();
    // this.AIUpdateDisplay(playerAI); // if you want to visualize AI's ships
  },

  playerPlaceShip(player, shipClass, [x, y], dir) {
    const playerGameboard = player.playerBoard;
    const shipPlaced = shipClass;
    const pos0 = x;
    const pos1 = y;
    const direction = dir;

    if (
      playerGameboard.placeShip(shipPlaced, [pos0, pos1], direction) === false
    ) {
      return;
    } // place the ship in players gameboard // if false is returned then exit, something went wrong

    const ship = playerGameboard.getShip(shipPlaced); // store the ship
    (0,_components_dom_manipulation_js__WEBPACK_IMPORTED_MODULE_3__.placeShips)(playerOne, ship);
  },

  AIUpdateDisplay(playerAI) {
    const AIShips = playerAI.playerBoard.ships;

    AIShips.forEach((ship) => {
      (0,_components_dom_manipulation_js__WEBPACK_IMPORTED_MODULE_3__.placeShips)(playerAI, ship);
    });
  },
};

// const gameLoop = () => {};

gameStart.init();

gameStart.playerPlaceShip(playerOne, 'Carrier', [0, 0], 'hor');
gameStart.playerPlaceShip(playerOne, 'Battleship', [1, 7], 'ver');
gameStart.playerPlaceShip(playerOne, 'Destroyer', [5, 4], 'ver');
gameStart.playerPlaceShip(playerOne, 'Submarine', [3, 1], 'ver');
gameStart.playerPlaceShip(playerOne, 'PatrolBoat', [4, 9], 'ver');

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSw4RUFBOEU7QUFDOUU7QUFDQSx1REFBdUQ7O0FBRXZEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQ7QUFDOUQ7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQixNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxNQUFNLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQy9JdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsSUFBSSxFQUFDOzs7Ozs7O1VDcERwQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTnlCO0FBQ0g7QUFDc0I7QUFDb0M7O0FBRWhGLGtCQUFrQiw2REFBTTs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUksaUZBQWdCO0FBQ3BCLElBQUksaUZBQWdCOztBQUVwQjtBQUNBLHVDQUF1QztBQUN2QyxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU4sc0RBQXNEO0FBQ3RELElBQUksMkVBQVU7QUFDZCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLDJFQUFVO0FBQ2hCLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguaHRtbCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Nzcy9zdHlsZS5jc3M/MGE0OCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXBvbmVudHMvZG9tLW1hbmlwdWxhdGlvbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXBvbmVudHMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY29tcG9uZW50cy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jb21wb25lbnRzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE1vZHVsZVxudmFyIGNvZGUgPSBcIjwhRE9DVFlQRSBodG1sPlxcbjxodG1sPlxcblxcbjxoZWFkPlxcbiAgICA8bWV0YSBjaGFyc2V0PVxcXCJ1dGYtOFxcXCI+XFxuICAgIDxtZXRhIGh0dHAtZXF1aXY9XFxcIlgtVUEtQ29tcGF0aWJsZVxcXCIgY29udGVudD1cXFwiSUU9ZWRnZVxcXCI+XFxuICAgIDx0aXRsZT5CYXR0bGVzaGlwPC90aXRsZT5cXG4gICAgPG1ldGEgbmFtZT1cXFwiZGVzY3JpcHRpb25cXFwiIGNvbnRlbnQ9XFxcIlxcXCI+XFxuICAgIDxtZXRhIG5hbWU9XFxcInZpZXdwb3J0XFxcIiBjb250ZW50PVxcXCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MVxcXCI+XFxuPC9oZWFkPlxcblxcbjxib2R5PlxcbiAgICA8bWFpbiBjbGFzcz1cXFwibWFpbi1jb250YWluZXJcXFwiPlxcbiAgICAgICAgPGgxPkJhdHRsZXNoaXA8L2gxPlxcblxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicGxheWVycy1jb250YWluZXJcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInBsYXllci1vbmUtY29udGFpbmVyXFxcIj5cXG5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwbGF5ZXItdHdvLWNvbnRhaW5lclxcXCI+XFxuXFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgIDxkaXYgaWQ9XFxcImhpbnRDb250YWluZXJcXFwiPlxcbiAgICAgICAgICAgIDxwPkhpbnQ6IENsaWNrIG9uIGFueSBvbmUgb2YgeW91ciBzaGlwcyB0byByZWxvY2F0ZSBpdDwvcD5cXG4gICAgICAgICAgICA8cD5IaW50OiBXaGlsZSBzZWFyY2hpbmcgZm9yIGEgbmV3IHBvc2l0aW9uIGZvciB5b3VyIHNoaXAsIHByZXNzIFIgdG8gcm90YXRlIGl0PC9wPlxcbiAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICA8IS0tIDxkaXYgY2xhc3M9XFxcImhlbHAtaW5zdFxcXCI+XFxuICAgICAgICAgICAgPHA+Q2FycmllcjwvcD5cXG4gICAgICAgICAgICA8cD5CYXR0bGVzaGlwPC9wPlxcbiAgICAgICAgICAgIDxwPkRlc3Ryb3llcjwvcD5cXG4gICAgICAgICAgICA8cD5TdWJtYXJpbmU8L3A+XFxuICAgICAgICAgICAgPHA+UGF0cm9sIEJvYXQ8L3A+XFxuICAgICAgICA8L2Rpdj4gLS0+XFxuICAgIDwvbWFpbj5cXG48L2JvZHk+XFxuXFxuPC9odG1sPlwiO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgY29kZTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJjb25zdCBwbGF5ZXJPbmVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLW9uZS1jb250YWluZXInKTtcbmNvbnN0IHBsYXllclR3b0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItdHdvLWNvbnRhaW5lcicpO1xuY29uc3QgY29udGVudFBhcmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLWNvbnRhaW5lcicpO1xuXG5jb25zdCBnZXRQbGF5ZXJDb250YWluZXIgPSAodGhpc1BsYXllcikgPT4ge1xuICBsZXQgY3VycmVudFBsYXllckNvbnRhaW5lcjtcbiAgaWYgKHRoaXNQbGF5ZXIuZ2V0TmFtZSgpICE9PSAnQ29tcHV0ZXInKSB7XG4gICAgY3VycmVudFBsYXllckNvbnRhaW5lciA9IHBsYXllck9uZUNvbnRhaW5lcjtcbiAgfSBlbHNlIGlmICh0aGlzUGxheWVyLmdldE5hbWUoKSA9PT0gJ0NvbXB1dGVyJykge1xuICAgIGN1cnJlbnRQbGF5ZXJDb250YWluZXIgPSBwbGF5ZXJUd29Db250YWluZXI7XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRQbGF5ZXJDb250YWluZXI7XG59O1xuXG5jb25zdCBkZWNsYXJlV2lubmVyID0gKHBsYXllcikgPT4ge1xuICBsZXQgd2lubmVyQ29uZ3JhdHNUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHdpbm5lckNvbmdyYXRzVGV4dC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3dpbm5lckNvbmdyYXRzJyk7XG4gIHdpbm5lckNvbmdyYXRzVGV4dC50ZXh0Q29udGVudCA9IGBDb25ncmF0cyAke3BsYXllci5nZXROYW1lKCl9IHdvbiB0aGUgZ2FtZSFgO1xuICBjb250ZW50UGFyZW50LmFwcGVuZENoaWxkKHdpbm5lckNvbmdyYXRzVGV4dCk7XG59O1xuXG5jb25zdCBBSUF0dGFja3NET00gPSAodGhpc1BsYXllcikgPT4ge1xuICBjb25zb2xlLmxvZyh0aGlzUGxheWVyKTtcbiAgY29uc3QgQUlBdHRhY2tDb29yZHMgPSB0aGlzUGxheWVyLkFJQXR0YWNrcygpO1xuICBjb25zdCBkYXRhSUQgPSBgJHtBSUF0dGFja0Nvb3Jkc1swXX0gJHtBSUF0dGFja0Nvb3Jkc1sxXX1gO1xuICBjb25zdCBjZWxsID0gcGxheWVyT25lQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3I9JyR7ZGF0YUlEfSddYCk7XG4gIGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnY2VsbCcpO1xuICAvLyBvbmx5IHRoZSBodW1hbidzIHNoaXBzIGhhdmUgaWQgdG8gdmlzdWFsaXplIHRoZW0gaW4gdGhlIGJvYXJkIHdpdGggZGlmZmVyZW50IGNvbG9yc1xuICBpZiAoY2VsbC5oYXNBdHRyaWJ1dGUoJ2lkJykpIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICB9IGVsc2Uge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnbWlzc2VkJyk7XG4gIH1cbn07XG5cbmNvbnN0IHJlY2lldmVBdHRhY2sgPSAoZGlzcGxheUNlbGwsIGFycmF5Rm9ybWF0LCB0aGlzUGxheWVyKSA9PiB7XG4gIGRpc3BsYXlDZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2NlbGwnKTtcbiAgY29uc3QgcGxheWVyT25lQXR0YWNrcyA9IHRoaXNQbGF5ZXIub3Bwb25lbnQuYXR0YWNrcyhhcnJheUZvcm1hdCk7XG4gIC8vIHdoZW4gd2UgY2xpY2sgb24gcGxheWVyVHdvJ3MgYm9hcmQgcGxheWVyVHdvJ3Mgb3Bwb25lbnQgYXR0YWNrcy5cbiAgaWYgKHBsYXllck9uZUF0dGFja3MgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSAvLyB1bmRlZmluZWQgaXMgcmV0dXJuZWQgd2hlbiB0aGUgcG9zaXRpb24gaXMgYWxyZWFkeSBzaG90XG5cbiAgaWYgKHBsYXllck9uZUF0dGFja3MpIHtcbiAgICBkaXNwbGF5Q2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgfSBlbHNlIHtcbiAgICBkaXNwbGF5Q2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzZWQnKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcblxuICAvLyBub3cgaXQncyBBSSdzIHR1cm4gdG8gYXR0YWNrXG59O1xuXG5jb25zdCBjcmVhdGVQbGF5ZXJHcmlkID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB0aGlzUGxheWVyID0gcGxheWVyO1xuICBjb25zdCBhcnJheUdyaWQgPSB0aGlzUGxheWVyLnBsYXllckJvYXJkLmdhbWVib2FyZDtcbiAgY29uc3QgcGxheWVyQ29udGFpbmVyID0gZ2V0UGxheWVyQ29udGFpbmVyKHRoaXNQbGF5ZXIpO1xuXG4gIGlmIChwbGF5ZXJDb250YWluZXIgPT09IHBsYXllclR3b0NvbnRhaW5lcikge1xuICAgIGFycmF5R3JpZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICByb3cuZm9yRWFjaCgoY2VsbCwgY2VsbEluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGRpc3BsYXlDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRpc3BsYXlDZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgZGlzcGxheUNlbGwuZGF0YXNldC5jb29yID0gYCR7cm93SW5kZXh9ICR7Y2VsbEluZGV4fWA7XG4gICAgICAgIGNvbnN0IGFycmF5Rm9ybWF0ID0gW3Jvd0luZGV4LCBjZWxsSW5kZXhdO1xuICAgICAgICBkaXNwbGF5Q2VsbC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICdjbGljaycsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB0aGlzUGxheWVyLndpbm5lciA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgICB0aGlzUGxheWVyLm9wcG9uZW50Lndpbm5lciA9PT0gdHJ1ZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWNpZXZlQXR0YWNrKGRpc3BsYXlDZWxsLCBhcnJheUZvcm1hdCwgdGhpc1BsYXllcikgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIEFJQXR0YWNrc0RPTSh0aGlzUGxheWVyKTtcbiAgICAgICAgICAgICAgLy8gXiBmYWxzZSB3aWxsIG9ubHkgYmUgcmV0dXJuZWQgaWYgcGxheWVyT25lIGF0dGFjayBpcyB1bmRlZmluZWQgd2hpY2ggbWVhbnMgcG9zIGlzIGFscmVhZHkgc2hvdCxcbiAgICAgICAgICAgICAgLy8gaW4gd2hpY2ggY2FzZSBBSSBkb2Vzbid0IGF0dGFjayBhbmQgd2Ugd2FpdCBmb3IgcGxheWVyIHRvIGNsaWNrIG9uIGEgdGlsZSB0aGF0IGhhc24ndCBiZWVuIHNob3RcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzUGxheWVyLndpbm5lciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICBkZWNsYXJlV2lubmVyKHRoaXNQbGF5ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXNQbGF5ZXIub3Bwb25lbnQud2lubmVyID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIGRlY2xhcmVXaW5uZXIodGhpc1BsYXllci5vcHBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICBwbGF5ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoZGlzcGxheUNlbGwpO1xuICAgICAgfSk7XG4gICAgfSk7IC8vIGFkZGluZyBldmVudGxpc3RlbmVyIGZvciBwbGF5ZXJUd29Db250YWluZXIgc2luY2UgdGhpcyBpcyB0aGUgY29udGFpbmVyIHRoYXQgdGhlIGh1bWFuIHBsYXllciB3aWxsIGJlIGF0dGFja2luZ1xuICB9IGVsc2Uge1xuICAgIGFycmF5R3JpZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICByb3cuZm9yRWFjaCgoY2VsbCwgY2VsbEluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGRpc3BsYXlDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRpc3BsYXlDZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgZGlzcGxheUNlbGwuZGF0YXNldC5jb29yID0gYCR7cm93SW5kZXh9ICR7Y2VsbEluZGV4fWA7XG4gICAgICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXNwbGF5Q2VsbCk7XG4gICAgICB9KTtcbiAgICB9KTsgLy8gdGhpcyBpcyB0aGUgcGxheWVyT25lQ29udGFpbmVyXG4gIH1cblxuICBwbGF5ZXJDb250YWluZXIuc3R5bGUuZ3JpZFRlbXBsYXRlQ29sdW1ucyA9IGByZXBlYXQoJHthcnJheUdyaWQubGVuZ3RofSwgYXV0bylgO1xuICBwbGF5ZXJDb250YWluZXIuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHthcnJheUdyaWQubGVuZ3RofSwgYXV0bylgO1xufTtcblxuY29uc3QgYWRkSG92ZXJFZmZlY3QgPSAobGVuZ3RoLCBwbGFjZUNlbGwsIGRpcmVjdGlvbikgPT4ge1xuICBjb25zdCBzaGlwTGVuZ3RoID0gbGVuZ3RoO1xuXG4gIGNvbnN0IGRhdGFJRCA9IHBsYWNlQ2VsbC5kYXRhc2V0LmNvb3I7XG4gIGlmIChkYXRhSUQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB4UG9zID0gTnVtYmVyKGRhdGFJRFswXSk7XG4gIGxldCB5UG9zID0gTnVtYmVyKGRhdGFJRFsyXSk7IC8vIGRhdGFJRFsxXSBpcyBlbXB0eSBzcGFjZVxuXG4gIGxldCBzZWxlY3RlZENlbGwgPSBwbGF5ZXJPbmVDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICBgW2RhdGEtY29vcj0nJHt4UG9zfSAke3lQb3N9J11gXG4gICk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZGlyZWN0aW9uID09PSAndmVyJykge1xuICAgICAgc2VsZWN0ZWRDZWxsID0gcGxheWVyT25lQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS1jb29yPScke3hQb3MrK30gJHt5UG9zfSddYFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcicpIHtcbiAgICAgIHNlbGVjdGVkQ2VsbCA9IHBsYXllck9uZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEtY29vcj0nJHt4UG9zfSAke3lQb3MrK30nXWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdGVkQ2VsbCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNlbGVjdGVkQ2VsbC5jbGFzc0xpc3QuYWRkKCdwbGFjaW5nJyk7XG4gIH1cbn07XG5cbmNvbnN0IHBsYXllck1vdmVTaGlwID0gKHNoaXBMZW5ndGgsIHNoaXBQbGFjZWQsIHBsYXllcikgPT4ge1xuICBpZiAocGxheWVyLmFsbFNob3RzLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfSAvLyBpZiBnYW1lIHN0YXJ0ZWQgLy8gZmlyc3Qgc2hvdCB3YXMgZmlyZWQsIHRoZW4gZXhpdCwgcGxheWVyIGlzIG5vdCBhbGxvd2VkIHRvIG1vdmUgc2hpcHNcblxuICBsZXQgZGlyZWN0aW9uID0gJ3Zlcic7XG5cbiAgY29uc3QgY2hhbmdlSG92ZXJEaXJlY3Rpb24gPSAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJ3InKSB7XG4gICAgICBkaXJlY3Rpb24gPT09ICd2ZXInID8gKGRpcmVjdGlvbiA9ICdob3InKSA6IChkaXJlY3Rpb24gPSAndmVyJyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IF9wbGFjZUxpc3RlbmVyID0gKHBsYWNlQ2VsbCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IHBsYWNlQ2VsbC50YXJnZXQ7XG4gICAgY29uc3Qgc2hpcCA9IHNoaXBQbGFjZWQ7XG4gICAgaWYgKG5ld1NoaXBQb3ModGFyZ2V0LCBzaGlwLCBwbGF5ZXIsIGRpcmVjdGlvbikpIHtcbiAgICAgIHBsYXllck9uZUNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGNoYW5nZUhvdmVyRGlyZWN0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgX2hvdmVyTGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHBsYWNlQ2VsbCA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IGxlbmd0aCA9IHNoaXBMZW5ndGg7XG4gICAgYWRkSG92ZXJFZmZlY3QobGVuZ3RoLCBwbGFjZUNlbGwsIGRpcmVjdGlvbik7XG5cbiAgICBwbGFjZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfcGxhY2VMaXN0ZW5lcik7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlSG92ZXJFZmZlY3QgPSAoKSA9PiB7XG4gICAgY29uc3QgY2VsbHMgPSBwbGF5ZXJPbmVDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmNlbGwnKTtcbiAgICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYWNpbmcnKTtcbiAgICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfcGxhY2VMaXN0ZW5lcik7XG4gICAgfSk7XG4gIH07XG5cbiAgaWYgKHBsYXllck9uZUNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVycykge1xuICAgIHBsYXllck9uZUNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgcGxheWVyT25lQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIF9ob3Zlckxpc3RlbmVyKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGNoYW5nZUhvdmVyRGlyZWN0aW9uKTtcblxuICBwbGF5ZXJPbmVDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgcGxheWVyT25lQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIF9ob3Zlckxpc3RlbmVyKTtcbiAgICByZW1vdmVIb3ZlckVmZmVjdCgpO1xuICB9O1xuXG4gIC8vIHJlbW92ZSB0aGUgaG92ZXIgZWZmZWN0IG9uIGNlbGxzIGFmdGVyIG1vdXNlb3V0XG4gIHBsYXllck9uZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHJlbW92ZUhvdmVyRWZmZWN0KTtcbn07XG5cbmNvbnN0IHJlbW92ZU9sZFNoaXBQb3MgPSAob2xkU2hpcFBvc0FycmF5KSA9PiB7XG4gIGNvbnN0IHBvc2l0aW9uc1RvUmVtb3ZlID0gb2xkU2hpcFBvc0FycmF5O1xuICBwb3NpdGlvbnNUb1JlbW92ZS5mb3JFYWNoKChwb3MpID0+IHtcbiAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtY29vcj0nJHtwb3NbMF19ICR7cG9zWzFdfSddYCk7XG4gICAgY2VsbC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgY29uc3QgY2xvbmUgPSBjZWxsLmNsb25lTm9kZShmYWxzZSk7XG4gICAgY2VsbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjbG9uZSwgY2VsbCk7XG4gIH0pO1xuICAvLyBjbGVhbmluZyBvbGQgcG9zaXRpb25zIG9mIHRoZSByZWxvY2F0ZWQgc2hpcCwgcmVtb3ZpbmcgaXRzIGlkIGFuZCByZXBsYWNpbmcgaXQgd2l0aCBhIG5vZGUgY2xvbmUsXG4gIC8vIHRvIHJlbW92ZSBpdHMgZXZlbnRMaXN0ZW5lcnMsIG5vdCB0aGUgYmVzdCB3YXkgb2YgZG9pbmcgdGhpc1xufTtcblxuY29uc3QgbmV3U2hpcFBvcyA9ICh0YXJnZXQsIHNoaXAsIHBsYXllciwgZGlyZWN0aW9uKSA9PiB7XG4gIGNvbnN0IHRhcmdldENlbGwgPSB0YXJnZXQuZGF0YXNldC5jb29yO1xuICBjb25zdCB0YXJnZXRTaGlwID0gc2hpcC5nZXRTaGlwQ2xhc3MoKTtcbiAgY29uc3QgcG9zID0gW051bWJlcih0YXJnZXRDZWxsWzBdKSwgTnVtYmVyKHRhcmdldENlbGxbMl0pXTtcblxuICBjb25zdCBvbGRTaGlwUG9zQXJyYXkgPSBbXTtcblxuICBjb25zdCBnZXRTaGlwID0gcGxheWVyLnBsYXllckJvYXJkLmdldFNoaXAodGFyZ2V0U2hpcCk7IC8vIHN0b3JlIHRoZSBvbGQgc2hpcFxuICBjb25zdCBvbGRTaGlwUG9zaXRpb25zID0gZ2V0U2hpcC5sZW5ndGg7XG4gIG9sZFNoaXBQb3NpdGlvbnMuZm9yRWFjaCgocG9zKSA9PiB7XG4gICAgb2xkU2hpcFBvc0FycmF5LnB1c2gocG9zKTtcbiAgfSk7XG5cbiAgbGV0IG5ld1NoaXBQb3M7XG5cbiAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcicpIHtcbiAgICBuZXdTaGlwUG9zID0gcGxheWVyLnBsYXllckJvYXJkLnBsYWNlU2hpcCh0YXJnZXRTaGlwLCBwb3MsICd2ZXInKTtcbiAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdob3InKSB7XG4gICAgbmV3U2hpcFBvcyA9IHBsYXllci5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAodGFyZ2V0U2hpcCwgcG9zLCAnaG9yJyk7XG4gIH1cblxuICBpZiAobmV3U2hpcFBvcyAhPT0gZmFsc2UpIHtcbiAgICByZW1vdmVPbGRTaGlwUG9zKG9sZFNoaXBQb3NBcnJheSk7XG4gICAgcGxhY2VTaGlwcyhwbGF5ZXIsIGdldFNoaXApO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuY29uc3QgcGxhY2VTaGlwcyA9IChwbGF5ZXIsIHNoaXApID0+IHtcbiAgY29uc3Qgc2hpcFBsYWNlZCA9IHNoaXA7XG4gIGNvbnN0IHBsYXllckNvbnRhaW5lciA9IGdldFBsYXllckNvbnRhaW5lcihwbGF5ZXIpO1xuICBsZXQgc2hpcE5hbWUgPSBzaGlwLnNoaXBDbGFzcztcbiAgY29uc3Qgc2hpcFBvc2l0aW9ucyA9IHNoaXBQbGFjZWQubGVuZ3RoOyAvLyBnZXQgdGhlIGxlbmd0aCBvZiB0aGUgc2hpcCAvLyBsZW5ndGggaXMgYWxzbyBhcnJheSBvZiB0aGUgcG9zaXRpb25zIGFzIGluIFszLCA1XSBldGMuXG4gIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwUGxhY2VkLmxlbmd0aC5sZW5ndGg7XG5cbiAgc2hpcFBvc2l0aW9ucy5mb3JFYWNoKChwb3MpID0+IHtcbiAgICBjb25zdCB4UG9zID0gcG9zWzBdOyAvLyBzdG9yZSB0aGUgZmlyc3QgY29vcmRpbmF0ZSBleHA6IFszLCA1XSBzdG9yZSAzXG4gICAgY29uc3QgeVBvcyA9IHBvc1sxXTsgLy8gc3RvcmUgdGhlIHNlY29uZCBjb29yZGluYXRlXG4gICAgY29uc3QgZGF0YUlEID0gYCR7eFBvc30gJHt5UG9zfWA7IC8vIHN0b3JlIGJvdGggb2YgdGhlIGNvb3JkaW5hdGVzIGludG8gYSBzdHJpbmcgZXhwOiAzIDVcblxuICAgIGNvbnN0IGNoaWxkID0gcGxheWVyQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3I9JyR7ZGF0YUlEfSddYCk7IC8vIF4gc3RvcmUgdGhlIGNoaWxkIGRpdiBvZiB0aGUgcGxheWVyQ29udGFpbmVyIHdpdGggdGhlIGN1cnJlbnQgZGF0YUlEXG4gICAgY2hpbGQuc2V0QXR0cmlidXRlKCdpZCcsIGAke3NoaXBOYW1lfWApOyAvLyBzZXQgdGhlIGRpdidzIGlkIHdpdGggdGhlIG5hbWUgb2YgdGhlIHNoaXAgYmVpbmcgcGxhY2VkXG4gICAgY2hpbGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgcGxheWVyTW92ZVNoaXAoc2hpcExlbmd0aCwgc2hpcFBsYWNlZCwgcGxheWVyKVxuICAgICk7XG4gIH0pO1xuICAvLyBtb3N0IGxpa2VseSBub3QgdGhlIGJlc3Qgd2F5IG9mIGRvaW5nIHRoaXMsIGJ1dCB0aGUgb25seSBzb2x1dGlvbiBpIGNhbiB0aGluayBvZiDwn5iVXG59O1xuXG5leHBvcnQgeyBjcmVhdGVQbGF5ZXJHcmlkLCBwbGFjZVNoaXBzIH07XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAuanMnO1xuXG5jbGFzcyBHYW1lYm9hcmQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmdhbWVib2FyZCA9IHRoaXMuY29uc3RydWN0b3IuY3JlYXRlR2FtZWJvYXJkKCk7XG4gICAgdGhpcy5zaGlwcyA9IFtdO1xuICAgIHRoaXMubWlzc2VkU2hvdHMgPSBbXTsgLy8gZm9yZ290IGFib3V0IHRoaXMgYW5kIGRpZG4ndCB1c2UgaXQgdG8gdmlzdWFsaXplIG1pc3NlZCBoaXRzXG4gIH1cblxuICBzdGF0aWMgY3JlYXRlR2FtZWJvYXJkKCkge1xuICAgIGNvbnN0IGJvYXJkID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpICs9IDEpIHtcbiAgICAgIGJvYXJkW2ldID0gW107XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqICs9IDEpIHtcbiAgICAgICAgYm9hcmRbaV1bal0gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYm9hcmQ7XG4gIH1cblxuICBwbGFjZVNoaXAocywgW3gsIHldLCBkaXIpIHtcbiAgICBsZXQgbmV3U2hpcDtcblxuICAgIGNvbnN0IGNoZWNrU2hpcEV4aXN0cyA9IHRoaXMuZ2V0U2hpcChzKTtcbiAgICBpZiAoISFjaGVja1NoaXBFeGlzdHMpIHtcbiAgICAgIG5ld1NoaXAgPSBjaGVja1NoaXBFeGlzdHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1NoaXAgPSBuZXcgU2hpcChzKTtcbiAgICB9IC8vIGlmIHRoZSBzaGlwIHdlIGFyZSBnaXZlbiBleGlzdHMgdGhlbiBzZWxlY3QgdGhhdCBzaGlwLCB3ZSBhcmUgcmVsb2NhdGluZyBpdCwgZWxzZSBjcmVhdGUgYSBuZXcgb25lXG5cbiAgICBsZXQgeENvb3IgPSB4O1xuICAgIGxldCB5Q29vciA9IHk7XG5cbiAgICBjb25zdCBkaXJlY3Rpb24gPSBkaXI7XG4gICAgaWYgKGRpcmVjdGlvbiAhPT0gJ3ZlcicgJiYgZGlyZWN0aW9uICE9PSAnaG9yJykge1xuICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgZGlyZWN0aW9uIG9ubHkgXCJ2ZXJcIiBvciBcImhvclwiJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IHNoaXBMZW5ndGggPSBuZXdTaGlwLmdldExlbmd0aCgpOyAvLyBnaXZlcyB0aGUgbGVuZ3RoIG9mIHRoZSBzaGlwLCBhcyBpbiBsZW5ndGggb2YgdGhlIGFycmF5XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSAndmVyJykge1xuICAgICAgaWYgKHlDb29yIDwgMCB8fCB5Q29vciA+IDkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgWSBjb29yZGluYXRlcycpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoeENvb3IgLSAxICsgc2hpcExlbmd0aCA+IDkgfHwgeENvb3IgPCAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIFggY29vcmRpbmF0ZXMnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnaG9yJykge1xuICAgICAgaWYgKHlDb29yIC0gMSArIHNoaXBMZW5ndGggPiA5IHx8IHlDb29yIDwgMCkge1xuICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBZIGNvb3JkaW5hdGVzJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh4Q29vciA8IDAgfHwgeENvb3IgPiA5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIFggY29vcmRpbmF0ZXMnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRlbXBQb3NpdGlvbnMgPSBbXTtcblxuICAgIGlmICghIWNoZWNrU2hpcEV4aXN0cykge1xuICAgICAgbmV3U2hpcC5sZW5ndGguZm9yRWFjaCgocG9zKSA9PiB7XG4gICAgICAgIHRlbXBQb3NpdGlvbnMucHVzaChwb3MpO1xuICAgICAgICB0aGlzLmdhbWVib2FyZFtwb3NbMF1dW3Bvc1sxXV0gPSBudWxsO1xuICAgICAgfSk7XG4gICAgICAvLyBpZiB0aGUgc2hpcCB3ZSBhcmUgY3VycmVudGx5IHBsYWNpbmcgZXhpc3RzLCBtZWFuaW5nIHdlIGFyZSByZWxvY2F0aW5nIGl0LFxuICAgICAgLy8gdGhlbiByZXNldCBpdHMgcG9zaXRpb24gc28gY2hlY2tQcm94aW1pdHkgZG9lc24ndCBjaGVjayBmb3IgaXRzIG93biBwb3NpdGlvblxuICAgICAgLy8gYW5kIHB1c2ggaXRzIHBvc2l0aW9ucyB0byBhIHRlbXAgYXJyYXkuXG4gICAgfVxuICAgIC8vIGlmIGNoZWNrUGl4aW1pdHkgcmV0dXJucyB0cnVlIHRoZW4gd2Uga25vdyB3ZSBhcmUgcGxhY2luZyBvdXIgY3VycmVudCBzaGlwIHRvbyBjbG9zZSB0byBhbm90aGVyIHNoaXAsIGV4aXRcbiAgICBpZiAodGhpcy5jaGVja1Byb3hpbWl0eShbeCwgeV0sIHNoaXBMZW5ndGgsIGRpcmVjdGlvbikpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdvY2N1cGllZCBieSBzaGlwIG5lYXJieSAoc2lkZXMgb3IgdG9wL2JvdHRvbSBhbmQgZWRnZXMpJyk7XG4gICAgICAvLyBpZiB3ZSB0ZW1wUG9zaXRpb25zIGhhcyBsZW5ndGgsIG1lYW5pbmcgd2UgZmFpbGVkIHRvIHJlbG9jYXRlIGFuIGV4aXN0aW5nIHNoaXAsXG4gICAgICAvLyB0aGVuIHB1c2ggdGhhdCBleGlzdGluZyBzaGlwJ3MgcG9zaXRpb25zIGJhY2sgdG8gdGhlIGdhbWVib2FyZC5cbiAgICAgIGlmICh0ZW1wUG9zaXRpb25zLmxlbmd0aCkge1xuICAgICAgICB0ZW1wUG9zaXRpb25zLmZvckVhY2goKHBvcykgPT4ge1xuICAgICAgICAgIHRoaXMuZ2FtZWJvYXJkW3Bvc1swXV1bcG9zWzFdXSA9IG5ld1NoaXAuZ2V0U2hpcE5hbWUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gcmVzZXQgc2hpcCdzIGxlbmd0aCBzaW5jZSB3ZSBoYXZlIGl0IHNhdmVkIGF0IHZhcmlhYmxlIHNoaXBMZW5ndGhcbiAgICAvLyBhbmQgZmlsbCB0aGUgbGVuZ3RoIGFycmF5IHdpdGggdGhpcyBzaGlwJ3MgcG9zaXRpb25cbiAgICBuZXdTaGlwLmxlbmd0aCA9IFtdO1xuICAgIHdoaWxlIChzaGlwTGVuZ3RoID4gMCkge1xuICAgICAgbmV3U2hpcC5sZW5ndGgucHVzaChbeENvb3IsIHlDb29yXSk7XG4gICAgICBpZiAoZGlyZWN0aW9uID09PSAndmVyJykge1xuICAgICAgICB0aGlzLmdhbWVib2FyZFt4Q29vcl1beUNvb3JdID0gbmV3U2hpcC5nZXRTaGlwTmFtZSgpO1xuICAgICAgICB4Q29vciArPSAxO1xuICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdob3InKSB7XG4gICAgICAgIHRoaXMuZ2FtZWJvYXJkW3hDb29yXVt5Q29vcl0gPSBuZXdTaGlwLmdldFNoaXBOYW1lKCk7XG4gICAgICAgIHlDb29yICs9IDE7XG4gICAgICB9XG4gICAgICBzaGlwTGVuZ3RoIC09IDE7XG4gICAgfVxuXG4gICAgaWYgKCFjaGVja1NoaXBFeGlzdHMpIHtcbiAgICAgIHRoaXMuc2hpcHMucHVzaChuZXdTaGlwKTtcbiAgICB9IC8vIG9ubHkgcHVzaCBjdXJyZW50IHNoaXAgdG8gc2hpcHMgaWYgaXQncyBhIG5ldyBzaGlwXG4gIH1cblxuICBjaGVja1Byb3hpbWl0eShbeCwgeV0sIHNoaXBMZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIGxldCB4Q29vciA9IHg7XG4gICAgbGV0IHlDb29yID0geTtcbiAgICBsZXQgbGVuZ3RoID0gc2hpcExlbmd0aDtcbiAgICBsZXQgbW92ZXMgPSBbXTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSAndmVyJykge1xuICAgICAgbW92ZXMgPSBbXG4gICAgICAgIHsgeDogeENvb3IgLSAxLCB5OiB5Q29vciB9LFxuICAgICAgICB7IHg6IHhDb29yIC0gMSwgeTogeUNvb3IgLSAxIH0sXG4gICAgICAgIHsgeDogeENvb3IgLSAxLCB5OiB5Q29vciArIDEgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdob3InKSB7XG4gICAgICBtb3ZlcyA9IFtcbiAgICAgICAgeyB4OiB4Q29vciwgeTogeUNvb3IgLSAxIH0sXG4gICAgICAgIHsgeDogeENvb3IgLSAxLCB5OiB5Q29vciAtIDEgfSxcbiAgICAgICAgeyB4OiB4Q29vciArIDEsIHk6IHlDb29yIC0gMSB9LFxuICAgICAgXTtcbiAgICB9IC8vIF4gc3RhbmRhcmQgcG9zaXRpb25zIGZvciB0b3AgcGFydCBvZiB0aGUgc2hpcC5cblxuICAgIHdoaWxlIChsZW5ndGggPiAwKSB7XG4gICAgICBpZiAoZGlyZWN0aW9uID09PSAndmVyJykge1xuICAgICAgICBtb3Zlcy5wdXNoKHsgeDogeENvb3IsIHk6IHlDb29yIC0gMSB9LCB7IHg6IHhDb29yLCB5OiB5Q29vciArIDEgfSk7IC8vIHBvc2l0aW9ucyBmb3Igc2lkZXMgb2YgdGhlIHNoaXBcbiAgICAgICAgbW92ZXMucHVzaCh7IHg6IHhDb29yLCB5OiB5Q29vciB9KTsgLy8gcG9zaXRpb25zIGZvciB0aGUgc2hpcCBpdHNlbGZcbiAgICAgICAgeENvb3IgKz0gMTtcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG1vdmVzLnB1c2goXG4gICAgICAgICAgICB7IHg6IHhDb29yLCB5OiB5Q29vciB9LFxuICAgICAgICAgICAgeyB4OiB4Q29vciwgeTogeUNvb3IgLSAxIH0sXG4gICAgICAgICAgICB7IHg6IHhDb29yLCB5OiB5Q29vciArIDEgfVxuICAgICAgICAgICk7IC8vIF4gcG9zaXRpb25zIGZvciB0aGUgYm90dG9tIHBhcnQgb2YgdGhlIHNoaXAuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnaG9yJykge1xuICAgICAgICBtb3Zlcy5wdXNoKHsgeDogeENvb3IgLSAxLCB5OiB5Q29vciB9LCB7IHg6IHhDb29yICsgMSwgeTogeUNvb3IgfSk7IC8vIHBvc2l0aW9ucyBmb3Igc2lkZXMgb2YgdGhlIHNoaXBcbiAgICAgICAgbW92ZXMucHVzaCh7IHg6IHhDb29yLCB5OiB5Q29vciB9KTsgLy8gcG9zaXRpb25zIGZvciB0aGUgc2hpcCBpdHNlbGZcbiAgICAgICAgeUNvb3IgKz0gMTtcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG1vdmVzLnB1c2goXG4gICAgICAgICAgICB7IHg6IHhDb29yLCB5OiB5Q29vciB9LFxuICAgICAgICAgICAgeyB4OiB4Q29vciAtIDEsIHk6IHlDb29yIH0sXG4gICAgICAgICAgICB7IHg6IHhDb29yICsgMSwgeTogeUNvb3IgfVxuICAgICAgICAgICk7IC8vIF4gcG9zaXRpb25zIGZvciB0aGUgYm90dG9tIHBhcnQgb2YgdGhlIHNoaXAuXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGVuZ3RoIC09IDE7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VhcmNoQXJvdW5kID0gbW92ZXMuc29tZSgobSkgPT4ge1xuICAgICAgbGV0IHsgY2hlY2tYIH0gPSBtO1xuICAgICAgY2hlY2tYID0gbS54O1xuICAgICAgbGV0IHsgY2hlY2tZIH0gPSBtO1xuICAgICAgY2hlY2tZID0gbS55O1xuXG4gICAgICAvLyBpZiB3ZSBhcmUgc2VhcmNoaW5nIGZvciBvdXQgb2YgZ2FtZWJvYXJkIGJvcmRlciBqdXN0IHNraXBcbiAgICAgIGlmIChjaGVja1ggPCAwIHx8IGNoZWNrWCA+IDkgfHwgY2hlY2tZIDwgMCB8fCBjaGVja1kgPiA5KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZ2FtZWJvYXJkW2NoZWNrWF1bY2hlY2tZXSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBgJHt0aGlzLmdhbWVib2FyZFtjaGVja1hdW2NoZWNrWV19ICR7Y2hlY2tYfSAvICR7Y2hlY2tZfSBGSUxMRURgXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyByZXR1cm4gdHJ1ZSBpZiB0aGVyZSBpcyBhIHNoaXAgbmVhcmJ5XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoc2VhcmNoQXJvdW5kKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZWNlaXZlQXR0YWNrKFt4LCB5XSkge1xuICAgIGNvbnN0IHhDb29yID0geDtcbiAgICBjb25zdCB5Q29vciA9IHk7XG4gICAgaWYgKHhDb29yID4gOSB8fCB4Q29vciA8IDAgfHwgeUNvb3IgPiA5IHx8IHlDb29yIDwgMCkge1xuICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgY29vcmRpbmF0ZXMnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgaGl0Q29vciA9IHRoaXMuZ2FtZWJvYXJkW3hDb29yXVt5Q29vcl07XG5cbiAgICBpZiAoaGl0Q29vciAhPT0gbnVsbCkge1xuICAgICAgbGV0IHNoaXBIaXQ7XG4gICAgICBpZiAoaGl0Q29vciA9PT0gJ0NhcicpIHtcbiAgICAgICAgc2hpcEhpdCA9ICdDYXJyaWVyJztcbiAgICAgIH0gZWxzZSBpZiAoaGl0Q29vciA9PT0gJ0JhdCcpIHtcbiAgICAgICAgc2hpcEhpdCA9ICdCYXR0bGVzaGlwJztcbiAgICAgIH0gZWxzZSBpZiAoaGl0Q29vciA9PT0gJ0RlcycpIHtcbiAgICAgICAgc2hpcEhpdCA9ICdEZXN0cm95ZXInO1xuICAgICAgfSBlbHNlIGlmIChoaXRDb29yID09PSAnU3ViJykge1xuICAgICAgICBzaGlwSGl0ID0gJ1N1Ym1hcmluZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwSGl0ID0gJ1BhdHJvbEJvYXQnO1xuICAgICAgfVxuXG4gICAgICBzaGlwSGl0ID0gdGhpcy5nZXRTaGlwKHNoaXBIaXQpO1xuICAgICAgbGV0IGNvdW50ZXIgPSAxO1xuICAgICAgc2hpcEhpdC5sZW5ndGguc29tZSgocG9zKSA9PiB7XG4gICAgICAgIGlmIChwb3NbMF0gPT09IHhDb29yICYmIHBvc1sxXSA9PT0geUNvb3IpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pOyAvLyBeIGZpbmQgd2hpY2ggcG9zaXRpb24gd2UgYXJlIGhpdHRpbmcgdGhlIHNoaXAgZnJvbVxuICAgICAgc2hpcEhpdC5oaXQoY291bnRlcik7XG4gICAgICB0aGlzLmdhbWVib2FyZFt4Q29vcl1beUNvb3JdID0gJ2hpdCc7IC8vIHVwZGF0ZSBnYW1lYm9hcmQgdG8gZGlzcGxheSAnaGl0J1xuXG4gICAgICBjb25zb2xlLmxvZyhgaGl0dGluZyAke3NoaXBIaXQuc2hpcENsYXNzfSBmcm9tIHBvc2l0aW9uICR7Y291bnRlcn1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB0aGlzLm1pc3NlZFNob3RzLnB1c2goW3hDb29yLCB5Q29vcl0pOyAvLyBraW5kIG9mIGZvcmdvdCBhYm91dCB0aGlzLCB0aGlzIGlzIG5vdCBiZWlnbiB1c2VkXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5taXNzZWRTaG90cyk7XG4gICAgY29uc29sZS5sb2coJ2hpdCBtaXNzZWQnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjaGVja0FsbFNoaXBzU3VuaygpIHtcbiAgICBjb25zdCBzaGlwcyA9IHRoaXMuc2hpcHM7XG5cbiAgICBjb25zdCBBbGxTaGlwc0NoZWNrID0gc2hpcHMuZXZlcnkoKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwLmlzU3VuayA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICBpZiAoQWxsU2hpcHNDaGVjayA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldFNoaXAoc2hpcCkge1xuICAgIGNvbnN0IGFsbFNoaXBzID0gdGhpcy5zaGlwcztcblxuICAgIGNvbnN0IGZpbmRTaGlwID0gKGVsZW1lbnQpID0+IGVsZW1lbnQuc2hpcENsYXNzID09PSBzaGlwO1xuICAgIGNvbnN0IGNoZWNrU2hpcEV4aXN0cyA9IGFsbFNoaXBzLmZpbmQoZmluZFNoaXApO1xuICAgIGlmIChjaGVja1NoaXBFeGlzdHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gY29uc29sZS5sb2coJ25vIHN1Y2ggc2hpcCcpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2tTaGlwRXhpc3RzO1xuICB9XG5cbiAgcmVtb3ZlU2hpcChzaGlwKSB7XG4gICAgY29uc3Qgc2hpcFRvQmVSZW1vdmVkID0gdGhpcy5nZXRTaGlwKHNoaXApO1xuICAgIGNvbnN0IHBvc2l0aW9uc09mVGhlU2hpcCA9IHNoaXBUb0JlUmVtb3ZlZC5sZW5ndGg7XG5cbiAgICBwb3NpdGlvbnNPZlRoZVNoaXAuZm9yRWFjaCgocG9zKSA9PiB7XG4gICAgICB0aGlzLmdhbWVib2FyZFtwb3NbMF1dW3Bvc1sxXV0gPSBudWxsO1xuICAgIH0pO1xuICAgIHRoaXMuc2hpcHMuc3BsaWNlKHRoaXMuc2hpcHMuaW5kZXhPZihzaGlwVG9CZVJlbW92ZWQpLCAxKTsgLy8gcmVtb3ZlIHRoZSBzaGlwXG4gIH1cbn1cblxuLy8gY29uc3QgZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuLy8gZ2FtZWJvYXJkLnBsYWNlU2hpcCgnQ2FycmllcicsIFswLCAwXSwgJ2hvcicpO1xuLy8gZ2FtZWJvYXJkLnBsYWNlU2hpcCgnQmF0dGxlc2hpcCcsIFs2LCAyXSwgJ3ZlcicpO1xuLy8gZ2FtZWJvYXJkLnBsYWNlU2hpcCgnRGVzdHJveWVyJywgWzIsIDFdLCAndmVyJyk7XG4vLyBnYW1lYm9hcmQucGxhY2VTaGlwKCdTdWJtYXJpbmUnLCBbNSwgNl0sICd2ZXInKTtcbi8vIGdhbWVib2FyZC5wbGFjZVNoaXAoJ1BhdHJvbEJvYXQnLCBbOCwgOV0sICd2ZXInKTtcblxuLy8gZ2FtZWJvYXJkLnBsYWNlU2hpcCgnU3VibWFyaW5lJywgWzQsIDhdLCAndmVyJyk7XG5cbi8vIC8vIC8vIGdhbWVib2FyZC5yZW1vdmVTaGlwKCdTdWJtYXJpbmUnKTtcblxuLy8gLy8gLy8gZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soWzMsIDJdKTtcblxuLy8gZ2FtZWJvYXJkLmdhbWVib2FyZC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuLy8gfSk7XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDtcbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSAnLi9nYW1lYm9hcmQuanMnO1xuXG5jbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5wbGF5ZXJCb2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICB0aGlzLm9wcG9uZW50ID0gbnVsbDtcbiAgICB0aGlzLmFsbFNob3RzID0gW107XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLndpbm5lciA9IGZhbHNlO1xuICB9XG5cbiAgLy8gZ2V0VHVybigpIHtcbiAgLy8gICByZXR1cm4gdGhpcy5vcHBvbmVudDtcbiAgLy8gfVxuXG4gIGdldE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfVxuXG4gIGF0dGFja3MoW3gsIHldKSB7XG4gICAgaWYgKHRoaXMuY2hlY2tBbHJlYWR5U2hvdChbeCwgeV0pKSB7XG4gICAgICByZXR1cm47XG4gICAgICAvLyBpZiB0aGUgW3gsIHldIHBvc2l0aW9uIGlzIGFscmVhZHkgc2hvdCBhdCByZXR1cm4gLy8gZXhpdFxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFsbFNob3RzLnB1c2goW3gsIHldKTtcbiAgICAgIGNvbnN0IGF0dGFja09wcG9uZW50ID0gdGhpcy5vcHBvbmVudC5wbGF5ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKFt4LCB5XSk7IC8vIHJldHVybnMgdHJ1ZSBpZiBzaG90IGhpdCwgZmFsc2UgaWYgaXQgZGlkbid0XG4gICAgICBjb25zdCBpc0FsbE9wcG9uZW50U2hpcHNTdW5rID1cbiAgICAgICAgdGhpcy5vcHBvbmVudC5wbGF5ZXJCb2FyZC5jaGVja0FsbFNoaXBzU3VuaygpOyAvLyByZXR1cm5zIHRydWUgaWYgYWxsIHNoaXBzIGFyZSBzdW5rLCBmYWxzZSBvdGhlcndpc2VcblxuICAgICAgaWYgKGlzQWxsT3Bwb25lbnRTaGlwc1N1bmspIHRoaXMud2lubmVyID0gdHJ1ZTtcbiAgICAgIHJldHVybiBhdHRhY2tPcHBvbmVudDtcbiAgICB9XG4gIH1cblxuICBjaGVja0FscmVhZHlTaG90KFt4LCB5XSkge1xuICAgIGNvbnN0IGNoZWNrQWxyZWFkeVNob3QgPSB0aGlzLmFsbFNob3RzLnNvbWUoKHNob3QpID0+IHtcbiAgICAgIGlmIChzaG90WzBdID09PSB4ICYmIHNob3RbMV0gPT09IHkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBpZiAoY2hlY2tBbHJlYWR5U2hvdCA9PT0gdHJ1ZSkge1xuICAgICAgY29uc29sZS5sb2coJ3Bvc2l0aW9uIGlzIGFscmVhZHkgc2hvdCBhdCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJhbmRvbU51bSgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICB9XG5cbiAgcmFuZG9tRGlyKCkge1xuICAgIGNvbnN0IG15QXJyYXkgPSBbJ3ZlcicsICdob3InXTtcbiAgICByZXR1cm4gbXlBcnJheVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBteUFycmF5Lmxlbmd0aCldO1xuICB9XG5cbiAgQUlQbGFjZVNoaXBzKCkge1xuICAgIGNvbnN0IHBsYWNlQ2FycmllciA9ICgpID0+IHtcbiAgICAgIHRoaXMucGxheWVyQm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAnQ2FycmllcicsXG4gICAgICAgIFt0aGlzLnJhbmRvbU51bSgpLCB0aGlzLnJhbmRvbU51bSgpXSxcbiAgICAgICAgdGhpcy5yYW5kb21EaXIoKVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3QgcGxhY2VCYXR0bGVzaGlwID0gKCkgPT4ge1xuICAgICAgdGhpcy5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICdCYXR0bGVzaGlwJyxcbiAgICAgICAgW3RoaXMucmFuZG9tTnVtKCksIHRoaXMucmFuZG9tTnVtKCldLFxuICAgICAgICB0aGlzLnJhbmRvbURpcigpXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBwbGFjZURlc3Ryb3llciA9ICgpID0+IHtcbiAgICAgIHRoaXMucGxheWVyQm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAnRGVzdHJveWVyJyxcbiAgICAgICAgW3RoaXMucmFuZG9tTnVtKCksIHRoaXMucmFuZG9tTnVtKCldLFxuICAgICAgICB0aGlzLnJhbmRvbURpcigpXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBwbGFjZVN1Ym1hcmluZSA9ICgpID0+IHtcbiAgICAgIHRoaXMucGxheWVyQm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAnU3VibWFyaW5lJyxcbiAgICAgICAgW3RoaXMucmFuZG9tTnVtKCksIHRoaXMucmFuZG9tTnVtKCldLFxuICAgICAgICB0aGlzLnJhbmRvbURpcigpXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBwbGFjZVBhdHJvbEJvYXQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnBsYXllckJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgJ1BhdHJvbEJvYXQnLFxuICAgICAgICBbdGhpcy5yYW5kb21OdW0oKSwgdGhpcy5yYW5kb21OdW0oKV0sXG4gICAgICAgIHRoaXMucmFuZG9tRGlyKClcbiAgICAgICk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFsbFNoaXBzID0gdGhpcy5wbGF5ZXJCb2FyZC5zaGlwcztcbiAgICBjb25zdCBzaGlwc1RvQWRkID0gW1xuICAgICAgJ0NhcnJpZXInLFxuICAgICAgJ0JhdHRsZXNoaXAnLFxuICAgICAgJ0Rlc3Ryb3llcicsXG4gICAgICAnU3VibWFyaW5lJyxcbiAgICAgICdQYXRyb2xCb2F0JyxcbiAgICBdO1xuXG4gICAgd2hpbGUgKGFsbFNoaXBzLmxlbmd0aCAhPT0gNSkge1xuICAgICAgYWxsU2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICBjb25zdCBzaGlwTmFtZSA9IHNoaXAuZ2V0U2hpcENsYXNzKCk7XG4gICAgICAgIGlmIChzaGlwc1RvQWRkLmluY2x1ZGVzKHNoaXBOYW1lKSkge1xuICAgICAgICAgIHNoaXBzVG9BZGQuc3BsaWNlKHNoaXBzVG9BZGQuaW5kZXhPZihzaGlwTmFtZSksIDEpOyAvLyByZW1vdmUgdGhlIHNoaXBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzaGlwc1RvQWRkLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgaWYgKHNoaXAgPT09ICdDYXJyaWVyJykge1xuICAgICAgICAgIHBsYWNlQ2FycmllcigpO1xuICAgICAgICB9IGVsc2UgaWYgKHNoaXAgPT09ICdCYXR0bGVzaGlwJykge1xuICAgICAgICAgIHBsYWNlQmF0dGxlc2hpcCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHNoaXAgPT09ICdEZXN0cm95ZXInKSB7XG4gICAgICAgICAgcGxhY2VEZXN0cm95ZXIoKTtcbiAgICAgICAgfSBlbHNlIGlmIChzaGlwID09PSAnU3VibWFyaW5lJykge1xuICAgICAgICAgIHBsYWNlU3VibWFyaW5lKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2hpcCA9PT0gJ1BhdHJvbEJvYXQnKSB7XG4gICAgICAgICAgcGxhY2VQYXRyb2xCb2F0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIEFJQXR0YWNrcygpIHtcbiAgICBjb25zdCBhdHRhY2tDb29yID0gW3RoaXMucmFuZG9tTnVtKCksIHRoaXMucmFuZG9tTnVtKCldO1xuICAgIGlmICh0aGlzLmNoZWNrQWxyZWFkeVNob3QoW2F0dGFja0Nvb3JbMF0sIGF0dGFja0Nvb3JbMV1dKSkge1xuICAgICAgY29uc29sZS5sb2coJ0FJIGlzIGdvbm5hIHJldHJ5IGhpdHRpbmcnKTtcbiAgICAgIHJldHVybiB0aGlzLkFJQXR0YWNrcygpOyAvLyBkbyBBSUF0dGFja3MgdW50aWwgQUkgaGl0cyB3aXRoIGF2YWlsYWJsZSBwb3NpdGlvblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmF0dGFja3MoYXR0YWNrQ29vcik7XG4gICAgICByZXR1cm4gYXR0YWNrQ29vcjtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKHNoaXBDbGFzcykge1xuICAgIHRoaXMuc2hpcENsYXNzID0gc2hpcENsYXNzO1xuICAgIHRoaXMubGVuZ3RoID0gdGhpcy5hc3NpZ25DbGFzc0xlbmd0aCgpO1xuICAgIHRoaXMuaXNTdW5rID0gZmFsc2U7XG4gIH1cblxuICBhc3NpZ25DbGFzc0xlbmd0aCgpIHtcbiAgICBpZiAodGhpcy5zaGlwQ2xhc3MgPT09ICdDYXJyaWVyJykge1xuICAgICAgcmV0dXJuIFsxLCAyLCAzLCA0LCA1XTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hpcENsYXNzID09PSAnQmF0dGxlc2hpcCcpIHtcbiAgICAgIHJldHVybiBbMSwgMiwgMywgNF07XG4gICAgfVxuICAgIGlmICh0aGlzLnNoaXBDbGFzcyA9PT0gJ0Rlc3Ryb3llcicpIHtcbiAgICAgIHJldHVybiBbMSwgMiwgM107XG4gICAgfVxuICAgIGlmICh0aGlzLnNoaXBDbGFzcyA9PT0gJ1N1Ym1hcmluZScpIHtcbiAgICAgIHJldHVybiBbMSwgMiwgM107XG4gICAgfVxuICAgIGlmICh0aGlzLnNoaXBDbGFzcyA9PT0gJ1BhdHJvbEJvYXQnKSB7XG4gICAgICByZXR1cm4gWzEsIDJdO1xuICAgIH1cbiAgICByZXR1cm4gY29uc29sZS5sb2coJ3NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gIH1cblxuICBnZXRMZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoLmxlbmd0aDtcbiAgfVxuXG4gIGdldFNoaXBOYW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNoaXBDbGFzcy5zbGljZSgwLCAzKTtcbiAgfVxuXG4gIGdldFNoaXBDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlwQ2xhc3M7XG4gIH1cblxuICBoaXQobnVtKSB7XG4gICAgaWYgKHRoaXMubGVuZ3RoLmxlbmd0aCA+PSBudW0gJiYgbnVtID4gMCkge1xuICAgICAgdGhpcy5sZW5ndGhbbnVtIC0gMV0gPSAnaGl0JztcbiAgICAgIHRoaXMuc3VuaygpO1xuICAgIH1cbiAgfVxuXG4gIHN1bmsoKSB7XG4gICAgY29uc3QgY2hlY2tTdW5rID0gKGN1cnJlbnQpID0+IGN1cnJlbnQgPT09ICdoaXQnO1xuXG4gICAgaWYgKHRoaXMubGVuZ3RoLmV2ZXJ5KGNoZWNrU3VuaykpIHRoaXMuaXNTdW5rID0gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XG5pbXBvcnQgJy4vaW5kZXguaHRtbCc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vY29tcG9uZW50cy9wbGF5ZXIuanMnO1xuaW1wb3J0IHsgY3JlYXRlUGxheWVyR3JpZCwgcGxhY2VTaGlwcyB9IGZyb20gJy4vY29tcG9uZW50cy9kb20tbWFuaXB1bGF0aW9uLmpzJztcblxuY29uc3QgTmV3UGxheWVyID0gUGxheWVyO1xuXG5jb25zdCBwbGF5ZXJPbmUgPSBuZXcgTmV3UGxheWVyKCdIdW1hbicpO1xuY29uc3QgcGxheWVyQUkgPSBuZXcgTmV3UGxheWVyKCdDb21wdXRlcicpO1xucGxheWVyT25lLm9wcG9uZW50ID0gcGxheWVyQUk7XG5wbGF5ZXJBSS5vcHBvbmVudCA9IHBsYXllck9uZTtcblxuY29uc3QgZ2FtZVN0YXJ0ID0ge1xuICBpbml0KCkge1xuICAgIGNyZWF0ZVBsYXllckdyaWQocGxheWVyT25lKTtcbiAgICBjcmVhdGVQbGF5ZXJHcmlkKHBsYXllckFJKTtcblxuICAgIHBsYXllckFJLkFJUGxhY2VTaGlwcygpO1xuICAgIC8vIHRoaXMuQUlVcGRhdGVEaXNwbGF5KHBsYXllckFJKTsgLy8gaWYgeW91IHdhbnQgdG8gdmlzdWFsaXplIEFJJ3Mgc2hpcHNcbiAgfSxcblxuICBwbGF5ZXJQbGFjZVNoaXAocGxheWVyLCBzaGlwQ2xhc3MsIFt4LCB5XSwgZGlyKSB7XG4gICAgY29uc3QgcGxheWVyR2FtZWJvYXJkID0gcGxheWVyLnBsYXllckJvYXJkO1xuICAgIGNvbnN0IHNoaXBQbGFjZWQgPSBzaGlwQ2xhc3M7XG4gICAgY29uc3QgcG9zMCA9IHg7XG4gICAgY29uc3QgcG9zMSA9IHk7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gZGlyO1xuXG4gICAgaWYgKFxuICAgICAgcGxheWVyR2FtZWJvYXJkLnBsYWNlU2hpcChzaGlwUGxhY2VkLCBbcG9zMCwgcG9zMV0sIGRpcmVjdGlvbikgPT09IGZhbHNlXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBwbGFjZSB0aGUgc2hpcCBpbiBwbGF5ZXJzIGdhbWVib2FyZCAvLyBpZiBmYWxzZSBpcyByZXR1cm5lZCB0aGVuIGV4aXQsIHNvbWV0aGluZyB3ZW50IHdyb25nXG5cbiAgICBjb25zdCBzaGlwID0gcGxheWVyR2FtZWJvYXJkLmdldFNoaXAoc2hpcFBsYWNlZCk7IC8vIHN0b3JlIHRoZSBzaGlwXG4gICAgcGxhY2VTaGlwcyhwbGF5ZXJPbmUsIHNoaXApO1xuICB9LFxuXG4gIEFJVXBkYXRlRGlzcGxheShwbGF5ZXJBSSkge1xuICAgIGNvbnN0IEFJU2hpcHMgPSBwbGF5ZXJBSS5wbGF5ZXJCb2FyZC5zaGlwcztcblxuICAgIEFJU2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgcGxhY2VTaGlwcyhwbGF5ZXJBSSwgc2hpcCk7XG4gICAgfSk7XG4gIH0sXG59O1xuXG4vLyBjb25zdCBnYW1lTG9vcCA9ICgpID0+IHt9O1xuXG5nYW1lU3RhcnQuaW5pdCgpO1xuXG5nYW1lU3RhcnQucGxheWVyUGxhY2VTaGlwKHBsYXllck9uZSwgJ0NhcnJpZXInLCBbMCwgMF0sICdob3InKTtcbmdhbWVTdGFydC5wbGF5ZXJQbGFjZVNoaXAocGxheWVyT25lLCAnQmF0dGxlc2hpcCcsIFsxLCA3XSwgJ3ZlcicpO1xuZ2FtZVN0YXJ0LnBsYXllclBsYWNlU2hpcChwbGF5ZXJPbmUsICdEZXN0cm95ZXInLCBbNSwgNF0sICd2ZXInKTtcbmdhbWVTdGFydC5wbGF5ZXJQbGFjZVNoaXAocGxheWVyT25lLCAnU3VibWFyaW5lJywgWzMsIDFdLCAndmVyJyk7XG5nYW1lU3RhcnQucGxheWVyUGxhY2VTaGlwKHBsYXllck9uZSwgJ1BhdHJvbEJvYXQnLCBbNCwgOV0sICd2ZXInKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==