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
var code = "<!DOCTYPE html>\n<html>\n\n<head>\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <title>Battleship</title>\n    <meta name=\"description\" content=\"\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n</head>\n\n<body>\n    <main class=\"main-container\">\n        <h1>Battleship</h1>\n\n        <div class=\"players-container\">\n            <div class=\"player-one-container\">\n\n            </div>\n            <div class=\"player-two-container\">\n\n            </div>\n        </div>\n\n        <div class=\"help-inst\">\n            <p>Carrier</p>\n            <p>Battleship</p>\n            <p>Destroyer</p>\n            <p>Submarine</p>\n            <p>Patrol Boat</p>\n        </div>\n    </main>\n</body>\n\n</html>";
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

const addHoverEffect = (shipLength, e) => {
  const length = shipLength;

  const dataID = e.target.dataset.coor;
  if (dataID === undefined) {
    return;
  }

  let xPos = Number(dataID[0]);
  let yPos = Number(dataID[2]); // dataID[1] is empty space

  let selectedCell = playerOneContainer.querySelector(
    `[data-coor='${xPos} ${yPos}']`
  );

  for (let i = 0; i < length; i++) {
    selectedCell = playerOneContainer.querySelector(
      `[data-coor='${xPos++} ${yPos}']`
    );

    if (selectedCell === null) {
      return;
    }

    selectedCell.classList.add('placing');
  }
};

const removeHoverEffect = () => {
  const cells = document.querySelectorAll('.cell.placing');
  cells.forEach((cell) => {
    cell.classList.remove('placing');
  });
};

const playerMoveShip = (shipLength, shipPlaced, player) => {
  const _hoverListener = (e) => {
    addHoverEffect(shipLength, e);
  };

  const _placeListener = (e) => {
    // let placeCell = playerOneContainer.querySelector('.cell.placing');

    const ship = shipPlaced;
    newShipPos(e, ship, player);
  };

  if (playerOneContainer.removeEventListeners) {
    playerOneContainer.removeEventListeners();
  }

  playerOneContainer.addEventListener('mouseover', _hoverListener);
  playerOneContainer.addEventListener('click', _placeListener);

  playerOneContainer.removeEventListeners = () => {
    playerOneContainer.removeEventListener('mouseover', _hoverListener);
    playerOneContainer.removeEventListener('click', _placeListener);
  };

  // remove the hover effect on cells after mouseout
  playerOneContainer.addEventListener('mouseout', removeHoverEffect);

  // playerOneContainer.addEventListener('mouseover', function _listener(e) {
  //   hoverEffect(e, shipLength, 'mouseover');
  //   let placeCell = playerOneContainer.querySelector('.cell.placing');
  //   if (placeCell === null) {
  //     return;
  //   }
  //   placeCell.addEventListener('click', function _placeShipListener(e) {
  //     if (newShipPos(e, ship, player)) {
  //       playerOneContainer.removeEventListener('mouseover', _listener);
  //       placeCell.removeEventListener('click', _placeShipListener);
  //     } // if we placed the ship in it's new location successfully, then remove the eventListeners
  //   });
  // });
};

const removeOldShipPos = (oldShipPosArray) => {
  const positionsToRemove = oldShipPosArray;
  positionsToRemove.forEach((pos) => {
    const cell = document.querySelector(`[data-coor='${pos[0]} ${pos[1]}']`);
    cell.removeAttribute('id');
    const clone = cell.cloneNode(false);
    cell.parentNode.replaceChild(clone, cell);
  });
};

const newShipPos = (e, ship, player) => {
  const targetCell = e.target.dataset.coor;
  const targetShip = ship.getShipClass();
  const pos = [Number(targetCell[0]), Number(targetCell[2])];

  const oldShipPosArray = [];

  const getShip = player.playerBoard.getShip(targetShip); // store the old ship
  const oldShipPositions = getShip.length;
  oldShipPositions.forEach((pos) => {
    oldShipPosArray.push(pos);
  });

  const newShipPos = player.playerBoard.placeShip(targetShip, pos, 'ver');

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

    if (!!checkShipExists) {
      newShip.length.forEach((pos) => {
        this.gameboard[pos[0]][pos[1]] = null;
      }); // if the ship we are currently placing exists, meaning we are relocating it, then reset its position so checkProximity doesn't check for its own position
    }
    if (this.checkProximity([x, y], shipLength, direction)) {
      console.log('occupied by ship nearby (sides or top/bottom and edges)');
      return false;
    } // if checkPiximity returns true then we know we are placing our current ship too close to another ship, exit

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTnlCO0FBQ0g7QUFDc0I7QUFDb0M7O0FBRWhGLGtCQUFrQiw2REFBTTs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUksaUZBQWdCO0FBQ3BCLElBQUksaUZBQWdCOztBQUVwQjtBQUNBLHVDQUF1QztBQUN2QyxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU4sc0RBQXNEO0FBQ3RELElBQUksMkVBQVU7QUFDZCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLDJFQUFVO0FBQ2hCLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguaHRtbCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Nzcy9zdHlsZS5jc3M/MGE0OCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXBvbmVudHMvZG9tLW1hbmlwdWxhdGlvbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXBvbmVudHMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY29tcG9uZW50cy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jb21wb25lbnRzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE1vZHVsZVxudmFyIGNvZGUgPSBcIjwhRE9DVFlQRSBodG1sPlxcbjxodG1sPlxcblxcbjxoZWFkPlxcbiAgICA8bWV0YSBjaGFyc2V0PVxcXCJ1dGYtOFxcXCI+XFxuICAgIDxtZXRhIGh0dHAtZXF1aXY9XFxcIlgtVUEtQ29tcGF0aWJsZVxcXCIgY29udGVudD1cXFwiSUU9ZWRnZVxcXCI+XFxuICAgIDx0aXRsZT5CYXR0bGVzaGlwPC90aXRsZT5cXG4gICAgPG1ldGEgbmFtZT1cXFwiZGVzY3JpcHRpb25cXFwiIGNvbnRlbnQ9XFxcIlxcXCI+XFxuICAgIDxtZXRhIG5hbWU9XFxcInZpZXdwb3J0XFxcIiBjb250ZW50PVxcXCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MVxcXCI+XFxuPC9oZWFkPlxcblxcbjxib2R5PlxcbiAgICA8bWFpbiBjbGFzcz1cXFwibWFpbi1jb250YWluZXJcXFwiPlxcbiAgICAgICAgPGgxPkJhdHRsZXNoaXA8L2gxPlxcblxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicGxheWVycy1jb250YWluZXJcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInBsYXllci1vbmUtY29udGFpbmVyXFxcIj5cXG5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwbGF5ZXItdHdvLWNvbnRhaW5lclxcXCI+XFxuXFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImhlbHAtaW5zdFxcXCI+XFxuICAgICAgICAgICAgPHA+Q2FycmllcjwvcD5cXG4gICAgICAgICAgICA8cD5CYXR0bGVzaGlwPC9wPlxcbiAgICAgICAgICAgIDxwPkRlc3Ryb3llcjwvcD5cXG4gICAgICAgICAgICA8cD5TdWJtYXJpbmU8L3A+XFxuICAgICAgICAgICAgPHA+UGF0cm9sIEJvYXQ8L3A+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9tYWluPlxcbjwvYm9keT5cXG5cXG48L2h0bWw+XCI7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBjb2RlOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImNvbnN0IHBsYXllck9uZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItb25lLWNvbnRhaW5lcicpO1xuY29uc3QgcGxheWVyVHdvQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci10d28tY29udGFpbmVyJyk7XG5jb25zdCBjb250ZW50UGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4tY29udGFpbmVyJyk7XG5cbmNvbnN0IGdldFBsYXllckNvbnRhaW5lciA9ICh0aGlzUGxheWVyKSA9PiB7XG4gIGxldCBjdXJyZW50UGxheWVyQ29udGFpbmVyO1xuICBpZiAodGhpc1BsYXllci5nZXROYW1lKCkgIT09ICdDb21wdXRlcicpIHtcbiAgICBjdXJyZW50UGxheWVyQ29udGFpbmVyID0gcGxheWVyT25lQ29udGFpbmVyO1xuICB9IGVsc2UgaWYgKHRoaXNQbGF5ZXIuZ2V0TmFtZSgpID09PSAnQ29tcHV0ZXInKSB7XG4gICAgY3VycmVudFBsYXllckNvbnRhaW5lciA9IHBsYXllclR3b0NvbnRhaW5lcjtcbiAgfVxuICByZXR1cm4gY3VycmVudFBsYXllckNvbnRhaW5lcjtcbn07XG5cbmNvbnN0IGRlY2xhcmVXaW5uZXIgPSAocGxheWVyKSA9PiB7XG4gIGxldCB3aW5uZXJDb25ncmF0c1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgd2lubmVyQ29uZ3JhdHNUZXh0LnRleHRDb250ZW50ID0gYENvbmdyYXRzICR7cGxheWVyLmdldE5hbWUoKX0gd29uIHRoZSBnYW1lIWA7XG4gIGNvbnRlbnRQYXJlbnQuYXBwZW5kQ2hpbGQod2lubmVyQ29uZ3JhdHNUZXh0KTtcbn07XG5cbmNvbnN0IEFJQXR0YWNrc0RPTSA9ICh0aGlzUGxheWVyKSA9PiB7XG4gIGNvbnNvbGUubG9nKHRoaXNQbGF5ZXIpO1xuICBjb25zdCBBSUF0dGFja0Nvb3JkcyA9IHRoaXNQbGF5ZXIuQUlBdHRhY2tzKCk7XG4gIGNvbnN0IGRhdGFJRCA9IGAke0FJQXR0YWNrQ29vcmRzWzBdfSAke0FJQXR0YWNrQ29vcmRzWzFdfWA7XG4gIGNvbnN0IGNlbGwgPSBwbGF5ZXJPbmVDb250YWluZXIucXVlcnlTZWxlY3RvcihgW2RhdGEtY29vcj0nJHtkYXRhSUR9J11gKTtcbiAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdjZWxsJyk7XG4gIC8vIG9ubHkgdGhlIGh1bWFuJ3Mgc2hpcHMgaGF2ZSBpZCB0byB2aXN1YWxpemUgdGhlbSBpbiB0aGUgYm9hcmQgd2l0aCBkaWZmZXJlbnQgY29sb3JzXG4gIGlmIChjZWxsLmhhc0F0dHJpYnV0ZSgnaWQnKSkge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gIH0gZWxzZSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzZWQnKTtcbiAgfVxufTtcblxuY29uc3QgcmVjaWV2ZUF0dGFjayA9IChkaXNwbGF5Q2VsbCwgYXJyYXlGb3JtYXQsIHRoaXNQbGF5ZXIpID0+IHtcbiAgZGlzcGxheUNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnY2VsbCcpO1xuICBjb25zdCBwbGF5ZXJPbmVBdHRhY2tzID0gdGhpc1BsYXllci5vcHBvbmVudC5hdHRhY2tzKGFycmF5Rm9ybWF0KTtcbiAgLy8gd2hlbiB3ZSBjbGljayBvbiBwbGF5ZXJUd28ncyBib2FyZCBwbGF5ZXJUd28ncyBvcHBvbmVudCBhdHRhY2tzLlxuICBpZiAocGxheWVyT25lQXR0YWNrcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IC8vIHVuZGVmaW5lZCBpcyByZXR1cm5lZCB3aGVuIHRoZSBwb3NpdGlvbiBpcyBhbHJlYWR5IHNob3RcblxuICBpZiAocGxheWVyT25lQXR0YWNrcykge1xuICAgIGRpc3BsYXlDZWxsLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICB9IGVsc2Uge1xuICAgIGRpc3BsYXlDZWxsLmNsYXNzTGlzdC5hZGQoJ21pc3NlZCcpO1xuICB9XG4gIHJldHVybiB0cnVlO1xuXG4gIC8vIG5vdyBpdCdzIEFJJ3MgdHVybiB0byBhdHRhY2tcbn07XG5cbmNvbnN0IGNyZWF0ZVBsYXllckdyaWQgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHRoaXNQbGF5ZXIgPSBwbGF5ZXI7XG4gIGNvbnN0IGFycmF5R3JpZCA9IHRoaXNQbGF5ZXIucGxheWVyQm9hcmQuZ2FtZWJvYXJkO1xuICBjb25zdCBwbGF5ZXJDb250YWluZXIgPSBnZXRQbGF5ZXJDb250YWluZXIodGhpc1BsYXllcik7XG5cbiAgaWYgKHBsYXllckNvbnRhaW5lciA9PT0gcGxheWVyVHdvQ29udGFpbmVyKSB7XG4gICAgYXJyYXlHcmlkLmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBjZWxsSW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgZGlzcGxheUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGlzcGxheUNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbCcpO1xuICAgICAgICBkaXNwbGF5Q2VsbC5kYXRhc2V0LmNvb3IgPSBgJHtyb3dJbmRleH0gJHtjZWxsSW5kZXh9YDtcbiAgICAgICAgY29uc3QgYXJyYXlGb3JtYXQgPSBbcm93SW5kZXgsIGNlbGxJbmRleF07XG4gICAgICAgIGRpc3BsYXlDZWxsLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgJ2NsaWNrJyxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVjaWV2ZUF0dGFjayhkaXNwbGF5Q2VsbCwgYXJyYXlGb3JtYXQsIHRoaXNQbGF5ZXIpICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICBBSUF0dGFja3NET00odGhpc1BsYXllcik7XG4gICAgICAgICAgICAgIC8vIF4gZmFsc2Ugd2lsbCBvbmx5IGJlIHJldHVybmVkIGlmIHBsYXllck9uZSBhdHRhY2sgaXMgdW5kZWZpbmVkIHdoaWNoIG1lYW5zIHBvcyBpcyBhbHJlYWR5IHNob3QsXG4gICAgICAgICAgICAgIC8vIGluIHdoaWNoIGNhc2UgQUkgZG9lc24ndCBhdHRhY2sgYW5kIHdlIHdhaXQgZm9yIHBsYXllciB0byBjbGljayBvbiBhIHRpbGUgdGhhdCBoYXNuJ3QgYmVlbiBzaG90XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpc1BsYXllci53aW5uZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgZGVjbGFyZVdpbm5lcih0aGlzUGxheWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzUGxheWVyLm9wcG9uZW50Lndpbm5lciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICBkZWNsYXJlV2lubmVyKHRoaXNQbGF5ZXIub3Bwb25lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcbiAgICAgICAgcGxheWVyQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpc3BsYXlDZWxsKTtcbiAgICAgIH0pO1xuICAgIH0pOyAvLyBhZGRpbmcgZXZlbnRsaXN0ZW5lciBmb3IgcGxheWVyVHdvQ29udGFpbmVyIHNpbmNlIHRoaXMgaXMgdGhlIGNvbnRhaW5lciB0aGF0IHRoZSBodW1hbiBwbGF5ZXIgd2lsbCBiZSBhdHRhY2tpbmdcbiAgfSBlbHNlIHtcbiAgICBhcnJheUdyaWQuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgICAgcm93LmZvckVhY2goKGNlbGwsIGNlbGxJbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBkaXNwbGF5Q2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXNwbGF5Q2VsbC5jbGFzc0xpc3QuYWRkKCdjZWxsJyk7XG4gICAgICAgIGRpc3BsYXlDZWxsLmRhdGFzZXQuY29vciA9IGAke3Jvd0luZGV4fSAke2NlbGxJbmRleH1gO1xuICAgICAgICBwbGF5ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoZGlzcGxheUNlbGwpO1xuICAgICAgfSk7XG4gICAgfSk7IC8vIHRoaXMgaXMgdGhlIHBsYXllck9uZUNvbnRhaW5lclxuICB9XG5cbiAgcGxheWVyQ29udGFpbmVyLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7YXJyYXlHcmlkLmxlbmd0aH0sIGF1dG8pYDtcbiAgcGxheWVyQ29udGFpbmVyLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KCR7YXJyYXlHcmlkLmxlbmd0aH0sIGF1dG8pYDtcbn07XG5cbmNvbnN0IGFkZEhvdmVyRWZmZWN0ID0gKHNoaXBMZW5ndGgsIGUpID0+IHtcbiAgY29uc3QgbGVuZ3RoID0gc2hpcExlbmd0aDtcblxuICBjb25zdCBkYXRhSUQgPSBlLnRhcmdldC5kYXRhc2V0LmNvb3I7XG4gIGlmIChkYXRhSUQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB4UG9zID0gTnVtYmVyKGRhdGFJRFswXSk7XG4gIGxldCB5UG9zID0gTnVtYmVyKGRhdGFJRFsyXSk7IC8vIGRhdGFJRFsxXSBpcyBlbXB0eSBzcGFjZVxuXG4gIGxldCBzZWxlY3RlZENlbGwgPSBwbGF5ZXJPbmVDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICBgW2RhdGEtY29vcj0nJHt4UG9zfSAke3lQb3N9J11gXG4gICk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHNlbGVjdGVkQ2VsbCA9IHBsYXllck9uZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgYFtkYXRhLWNvb3I9JyR7eFBvcysrfSAke3lQb3N9J11gXG4gICAgKTtcblxuICAgIGlmIChzZWxlY3RlZENlbGwgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZWxlY3RlZENlbGwuY2xhc3NMaXN0LmFkZCgncGxhY2luZycpO1xuICB9XG59O1xuXG5jb25zdCByZW1vdmVIb3ZlckVmZmVjdCA9ICgpID0+IHtcbiAgY29uc3QgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2VsbC5wbGFjaW5nJyk7XG4gIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYWNpbmcnKTtcbiAgfSk7XG59O1xuXG5jb25zdCBwbGF5ZXJNb3ZlU2hpcCA9IChzaGlwTGVuZ3RoLCBzaGlwUGxhY2VkLCBwbGF5ZXIpID0+IHtcbiAgY29uc3QgX2hvdmVyTGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgIGFkZEhvdmVyRWZmZWN0KHNoaXBMZW5ndGgsIGUpO1xuICB9O1xuXG4gIGNvbnN0IF9wbGFjZUxpc3RlbmVyID0gKGUpID0+IHtcbiAgICAvLyBsZXQgcGxhY2VDZWxsID0gcGxheWVyT25lQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jZWxsLnBsYWNpbmcnKTtcblxuICAgIGNvbnN0IHNoaXAgPSBzaGlwUGxhY2VkO1xuICAgIG5ld1NoaXBQb3MoZSwgc2hpcCwgcGxheWVyKTtcbiAgfTtcblxuICBpZiAocGxheWVyT25lQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXJzKSB7XG4gICAgcGxheWVyT25lQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICBwbGF5ZXJPbmVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgX2hvdmVyTGlzdGVuZXIpO1xuICBwbGF5ZXJPbmVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfcGxhY2VMaXN0ZW5lcik7XG5cbiAgcGxheWVyT25lQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIHBsYXllck9uZUNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBfaG92ZXJMaXN0ZW5lcik7XG4gICAgcGxheWVyT25lQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3BsYWNlTGlzdGVuZXIpO1xuICB9O1xuXG4gIC8vIHJlbW92ZSB0aGUgaG92ZXIgZWZmZWN0IG9uIGNlbGxzIGFmdGVyIG1vdXNlb3V0XG4gIHBsYXllck9uZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHJlbW92ZUhvdmVyRWZmZWN0KTtcblxuICAvLyBwbGF5ZXJPbmVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgZnVuY3Rpb24gX2xpc3RlbmVyKGUpIHtcbiAgLy8gICBob3ZlckVmZmVjdChlLCBzaGlwTGVuZ3RoLCAnbW91c2VvdmVyJyk7XG4gIC8vICAgbGV0IHBsYWNlQ2VsbCA9IHBsYXllck9uZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY2VsbC5wbGFjaW5nJyk7XG4gIC8vICAgaWYgKHBsYWNlQ2VsbCA9PT0gbnVsbCkge1xuICAvLyAgICAgcmV0dXJuO1xuICAvLyAgIH1cbiAgLy8gICBwbGFjZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiBfcGxhY2VTaGlwTGlzdGVuZXIoZSkge1xuICAvLyAgICAgaWYgKG5ld1NoaXBQb3MoZSwgc2hpcCwgcGxheWVyKSkge1xuICAvLyAgICAgICBwbGF5ZXJPbmVDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgX2xpc3RlbmVyKTtcbiAgLy8gICAgICAgcGxhY2VDZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3BsYWNlU2hpcExpc3RlbmVyKTtcbiAgLy8gICAgIH0gLy8gaWYgd2UgcGxhY2VkIHRoZSBzaGlwIGluIGl0J3MgbmV3IGxvY2F0aW9uIHN1Y2Nlc3NmdWxseSwgdGhlbiByZW1vdmUgdGhlIGV2ZW50TGlzdGVuZXJzXG4gIC8vICAgfSk7XG4gIC8vIH0pO1xufTtcblxuY29uc3QgcmVtb3ZlT2xkU2hpcFBvcyA9IChvbGRTaGlwUG9zQXJyYXkpID0+IHtcbiAgY29uc3QgcG9zaXRpb25zVG9SZW1vdmUgPSBvbGRTaGlwUG9zQXJyYXk7XG4gIHBvc2l0aW9uc1RvUmVtb3ZlLmZvckVhY2goKHBvcykgPT4ge1xuICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1jb29yPScke3Bvc1swXX0gJHtwb3NbMV19J11gKTtcbiAgICBjZWxsLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcbiAgICBjb25zdCBjbG9uZSA9IGNlbGwuY2xvbmVOb2RlKGZhbHNlKTtcbiAgICBjZWxsLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKGNsb25lLCBjZWxsKTtcbiAgfSk7XG59O1xuXG5jb25zdCBuZXdTaGlwUG9zID0gKGUsIHNoaXAsIHBsYXllcikgPT4ge1xuICBjb25zdCB0YXJnZXRDZWxsID0gZS50YXJnZXQuZGF0YXNldC5jb29yO1xuICBjb25zdCB0YXJnZXRTaGlwID0gc2hpcC5nZXRTaGlwQ2xhc3MoKTtcbiAgY29uc3QgcG9zID0gW051bWJlcih0YXJnZXRDZWxsWzBdKSwgTnVtYmVyKHRhcmdldENlbGxbMl0pXTtcblxuICBjb25zdCBvbGRTaGlwUG9zQXJyYXkgPSBbXTtcblxuICBjb25zdCBnZXRTaGlwID0gcGxheWVyLnBsYXllckJvYXJkLmdldFNoaXAodGFyZ2V0U2hpcCk7IC8vIHN0b3JlIHRoZSBvbGQgc2hpcFxuICBjb25zdCBvbGRTaGlwUG9zaXRpb25zID0gZ2V0U2hpcC5sZW5ndGg7XG4gIG9sZFNoaXBQb3NpdGlvbnMuZm9yRWFjaCgocG9zKSA9PiB7XG4gICAgb2xkU2hpcFBvc0FycmF5LnB1c2gocG9zKTtcbiAgfSk7XG5cbiAgY29uc3QgbmV3U2hpcFBvcyA9IHBsYXllci5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAodGFyZ2V0U2hpcCwgcG9zLCAndmVyJyk7XG5cbiAgaWYgKG5ld1NoaXBQb3MgIT09IGZhbHNlKSB7XG4gICAgcmVtb3ZlT2xkU2hpcFBvcyhvbGRTaGlwUG9zQXJyYXkpO1xuICAgIHBsYWNlU2hpcHMocGxheWVyLCBnZXRTaGlwKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IHBsYWNlU2hpcHMgPSAocGxheWVyLCBzaGlwKSA9PiB7XG4gIGNvbnN0IHNoaXBQbGFjZWQgPSBzaGlwO1xuICBjb25zdCBwbGF5ZXJDb250YWluZXIgPSBnZXRQbGF5ZXJDb250YWluZXIocGxheWVyKTtcbiAgbGV0IHNoaXBOYW1lID0gc2hpcC5zaGlwQ2xhc3M7XG4gIGNvbnN0IHNoaXBQb3NpdGlvbnMgPSBzaGlwUGxhY2VkLmxlbmd0aDsgLy8gZ2V0IHRoZSBsZW5ndGggb2YgdGhlIHNoaXAgLy8gbGVuZ3RoIGlzIGFsc28gYXJyYXkgb2YgdGhlIHBvc2l0aW9ucyBhcyBpbiBbMywgNV0gZXRjLlxuICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcFBsYWNlZC5sZW5ndGgubGVuZ3RoO1xuXG4gIHNoaXBQb3NpdGlvbnMuZm9yRWFjaCgocG9zKSA9PiB7XG4gICAgY29uc3QgeFBvcyA9IHBvc1swXTsgLy8gc3RvcmUgdGhlIGZpcnN0IGNvb3JkaW5hdGUgZXhwOiBbMywgNV0gc3RvcmUgM1xuICAgIGNvbnN0IHlQb3MgPSBwb3NbMV07IC8vIHN0b3JlIHRoZSBzZWNvbmQgY29vcmRpbmF0ZVxuICAgIGNvbnN0IGRhdGFJRCA9IGAke3hQb3N9ICR7eVBvc31gOyAvLyBzdG9yZSBib3RoIG9mIHRoZSBjb29yZGluYXRlcyBpbnRvIGEgc3RyaW5nIGV4cDogMyA1XG5cbiAgICBjb25zdCBjaGlsZCA9IHBsYXllckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1jb29yPScke2RhdGFJRH0nXWApOyAvLyBeIHN0b3JlIHRoZSBjaGlsZCBkaXYgb2YgdGhlIHBsYXllckNvbnRhaW5lciB3aXRoIHRoZSBjdXJyZW50IGRhdGFJRFxuICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnaWQnLCBgJHtzaGlwTmFtZX1gKTsgLy8gc2V0IHRoZSBkaXYncyBpZCB3aXRoIHRoZSBuYW1lIG9mIHRoZSBzaGlwIGJlaW5nIHBsYWNlZFxuICAgIGNoaWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIHBsYXllck1vdmVTaGlwKHNoaXBMZW5ndGgsIHNoaXBQbGFjZWQsIHBsYXllcilcbiAgICApO1xuICB9KTtcbiAgLy8gbW9zdCBsaWtlbHkgbm90IHRoZSBiZXN0IHdheSBvZiBkb2luZyB0aGlzLCBidXQgdGhlIG9ubHkgc29sdXRpb24gaSBjYW4gdGhpbmsgb2Yg8J+YlVxufTtcblxuZXhwb3J0IHsgY3JlYXRlUGxheWVyR3JpZCwgcGxhY2VTaGlwcyB9O1xuIiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwLmpzJztcblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5nYW1lYm9hcmQgPSB0aGlzLmNvbnN0cnVjdG9yLmNyZWF0ZUdhbWVib2FyZCgpO1xuICAgIHRoaXMuc2hpcHMgPSBbXTtcbiAgICB0aGlzLm1pc3NlZFNob3RzID0gW107IC8vIGZvcmdvdCBhYm91dCB0aGlzIGFuZCBkaWRuJ3QgdXNlIGl0IHRvIHZpc3VhbGl6ZSBtaXNzZWQgaGl0c1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUdhbWVib2FyZCgpIHtcbiAgICBjb25zdCBib2FyZCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSArPSAxKSB7XG4gICAgICBib2FyZFtpXSA9IFtdO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaiArPSAxKSB7XG4gICAgICAgIGJvYXJkW2ldW2pdID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJvYXJkO1xuICB9XG5cbiAgcGxhY2VTaGlwKHMsIFt4LCB5XSwgZGlyKSB7XG4gICAgbGV0IG5ld1NoaXA7XG5cbiAgICBjb25zdCBjaGVja1NoaXBFeGlzdHMgPSB0aGlzLmdldFNoaXAocyk7XG4gICAgaWYgKCEhY2hlY2tTaGlwRXhpc3RzKSB7XG4gICAgICBuZXdTaGlwID0gY2hlY2tTaGlwRXhpc3RzO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdTaGlwID0gbmV3IFNoaXAocyk7XG4gICAgfSAvLyBpZiB0aGUgc2hpcCB3ZSBhcmUgZ2l2ZW4gZXhpc3RzIHRoZW4gc2VsZWN0IHRoYXQgc2hpcCwgd2UgYXJlIHJlbG9jYXRpbmcgaXQsIGVsc2UgY3JlYXRlIGEgbmV3IG9uZVxuXG4gICAgbGV0IHhDb29yID0geDtcbiAgICBsZXQgeUNvb3IgPSB5O1xuXG4gICAgY29uc3QgZGlyZWN0aW9uID0gZGlyO1xuICAgIGlmIChkaXJlY3Rpb24gIT09ICd2ZXInICYmIGRpcmVjdGlvbiAhPT0gJ2hvcicpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIGRpcmVjdGlvbiBvbmx5IFwidmVyXCIgb3IgXCJob3JcIicpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBzaGlwTGVuZ3RoID0gbmV3U2hpcC5nZXRMZW5ndGgoKTsgLy8gZ2l2ZXMgdGhlIGxlbmd0aCBvZiB0aGUgc2hpcCwgYXMgaW4gbGVuZ3RoIG9mIHRoZSBhcnJheVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcicpIHtcbiAgICAgIGlmICh5Q29vciA8IDAgfHwgeUNvb3IgPiA5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIFkgY29vcmRpbmF0ZXMnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHhDb29yIC0gMSArIHNoaXBMZW5ndGggPiA5IHx8IHhDb29yIDwgMCkge1xuICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBYIGNvb3JkaW5hdGVzJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcicpIHtcbiAgICAgIGlmICh5Q29vciAtIDEgKyBzaGlwTGVuZ3RoID4gOSB8fCB5Q29vciA8IDApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgWSBjb29yZGluYXRlcycpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoeENvb3IgPCAwIHx8IHhDb29yID4gOSkge1xuICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBYIGNvb3JkaW5hdGVzJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoISFjaGVja1NoaXBFeGlzdHMpIHtcbiAgICAgIG5ld1NoaXAubGVuZ3RoLmZvckVhY2goKHBvcykgPT4ge1xuICAgICAgICB0aGlzLmdhbWVib2FyZFtwb3NbMF1dW3Bvc1sxXV0gPSBudWxsO1xuICAgICAgfSk7IC8vIGlmIHRoZSBzaGlwIHdlIGFyZSBjdXJyZW50bHkgcGxhY2luZyBleGlzdHMsIG1lYW5pbmcgd2UgYXJlIHJlbG9jYXRpbmcgaXQsIHRoZW4gcmVzZXQgaXRzIHBvc2l0aW9uIHNvIGNoZWNrUHJveGltaXR5IGRvZXNuJ3QgY2hlY2sgZm9yIGl0cyBvd24gcG9zaXRpb25cbiAgICB9XG4gICAgaWYgKHRoaXMuY2hlY2tQcm94aW1pdHkoW3gsIHldLCBzaGlwTGVuZ3RoLCBkaXJlY3Rpb24pKSB7XG4gICAgICBjb25zb2xlLmxvZygnb2NjdXBpZWQgYnkgc2hpcCBuZWFyYnkgKHNpZGVzIG9yIHRvcC9ib3R0b20gYW5kIGVkZ2VzKScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gLy8gaWYgY2hlY2tQaXhpbWl0eSByZXR1cm5zIHRydWUgdGhlbiB3ZSBrbm93IHdlIGFyZSBwbGFjaW5nIG91ciBjdXJyZW50IHNoaXAgdG9vIGNsb3NlIHRvIGFub3RoZXIgc2hpcCwgZXhpdFxuXG4gICAgLy8gcmVzZXQgc2hpcCdzIGxlbmd0aCBzaW5jZSB3ZSBoYXZlIGl0IHNhdmVkIGF0IHZhcmlhYmxlIHNoaXBMZW5ndGhcbiAgICAvLyBhbmQgZmlsbCB0aGUgbGVuZ3RoIGFycmF5IHdpdGggdGhpcyBzaGlwJ3MgcG9zaXRpb25cbiAgICBuZXdTaGlwLmxlbmd0aCA9IFtdO1xuICAgIHdoaWxlIChzaGlwTGVuZ3RoID4gMCkge1xuICAgICAgbmV3U2hpcC5sZW5ndGgucHVzaChbeENvb3IsIHlDb29yXSk7XG4gICAgICBpZiAoZGlyZWN0aW9uID09PSAndmVyJykge1xuICAgICAgICB0aGlzLmdhbWVib2FyZFt4Q29vcl1beUNvb3JdID0gbmV3U2hpcC5nZXRTaGlwTmFtZSgpO1xuICAgICAgICB4Q29vciArPSAxO1xuICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdob3InKSB7XG4gICAgICAgIHRoaXMuZ2FtZWJvYXJkW3hDb29yXVt5Q29vcl0gPSBuZXdTaGlwLmdldFNoaXBOYW1lKCk7XG4gICAgICAgIHlDb29yICs9IDE7XG4gICAgICB9XG4gICAgICBzaGlwTGVuZ3RoIC09IDE7XG4gICAgfVxuXG4gICAgaWYgKCFjaGVja1NoaXBFeGlzdHMpIHtcbiAgICAgIHRoaXMuc2hpcHMucHVzaChuZXdTaGlwKTtcbiAgICB9IC8vIG9ubHkgcHVzaCBjdXJyZW50IHNoaXAgdG8gc2hpcHMgaWYgaXQncyBhIG5ldyBzaGlwXG4gIH1cblxuICBjaGVja1Byb3hpbWl0eShbeCwgeV0sIHNoaXBMZW5ndGgsIGRpcmVjdGlvbikge1xuICAgIGxldCB4Q29vciA9IHg7XG4gICAgbGV0IHlDb29yID0geTtcbiAgICBsZXQgbGVuZ3RoID0gc2hpcExlbmd0aDtcbiAgICBsZXQgbW92ZXMgPSBbXTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSAndmVyJykge1xuICAgICAgbW92ZXMgPSBbXG4gICAgICAgIHsgeDogeENvb3IgLSAxLCB5OiB5Q29vciB9LFxuICAgICAgICB7IHg6IHhDb29yIC0gMSwgeTogeUNvb3IgLSAxIH0sXG4gICAgICAgIHsgeDogeENvb3IgLSAxLCB5OiB5Q29vciArIDEgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdob3InKSB7XG4gICAgICBtb3ZlcyA9IFtcbiAgICAgICAgeyB4OiB4Q29vciwgeTogeUNvb3IgLSAxIH0sXG4gICAgICAgIHsgeDogeENvb3IgLSAxLCB5OiB5Q29vciAtIDEgfSxcbiAgICAgICAgeyB4OiB4Q29vciArIDEsIHk6IHlDb29yIC0gMSB9LFxuICAgICAgXTtcbiAgICB9IC8vIF4gc3RhbmRhcmQgcG9zaXRpb25zIGZvciB0b3AgcGFydCBvZiB0aGUgc2hpcC5cblxuICAgIHdoaWxlIChsZW5ndGggPiAwKSB7XG4gICAgICBpZiAoZGlyZWN0aW9uID09PSAndmVyJykge1xuICAgICAgICBtb3Zlcy5wdXNoKHsgeDogeENvb3IsIHk6IHlDb29yIC0gMSB9LCB7IHg6IHhDb29yLCB5OiB5Q29vciArIDEgfSk7IC8vIHBvc2l0aW9ucyBmb3Igc2lkZXMgb2YgdGhlIHNoaXBcbiAgICAgICAgbW92ZXMucHVzaCh7IHg6IHhDb29yLCB5OiB5Q29vciB9KTsgLy8gcG9zaXRpb25zIGZvciB0aGUgc2hpcCBpdHNlbGZcbiAgICAgICAgeENvb3IgKz0gMTtcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG1vdmVzLnB1c2goXG4gICAgICAgICAgICB7IHg6IHhDb29yLCB5OiB5Q29vciB9LFxuICAgICAgICAgICAgeyB4OiB4Q29vciwgeTogeUNvb3IgLSAxIH0sXG4gICAgICAgICAgICB7IHg6IHhDb29yLCB5OiB5Q29vciArIDEgfVxuICAgICAgICAgICk7IC8vIF4gcG9zaXRpb25zIGZvciB0aGUgYm90dG9tIHBhcnQgb2YgdGhlIHNoaXAuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnaG9yJykge1xuICAgICAgICBtb3Zlcy5wdXNoKHsgeDogeENvb3IgLSAxLCB5OiB5Q29vciB9LCB7IHg6IHhDb29yICsgMSwgeTogeUNvb3IgfSk7IC8vIHBvc2l0aW9ucyBmb3Igc2lkZXMgb2YgdGhlIHNoaXBcbiAgICAgICAgbW92ZXMucHVzaCh7IHg6IHhDb29yLCB5OiB5Q29vciB9KTsgLy8gcG9zaXRpb25zIGZvciB0aGUgc2hpcCBpdHNlbGZcbiAgICAgICAgeUNvb3IgKz0gMTtcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIG1vdmVzLnB1c2goXG4gICAgICAgICAgICB7IHg6IHhDb29yLCB5OiB5Q29vciB9LFxuICAgICAgICAgICAgeyB4OiB4Q29vciAtIDEsIHk6IHlDb29yIH0sXG4gICAgICAgICAgICB7IHg6IHhDb29yICsgMSwgeTogeUNvb3IgfVxuICAgICAgICAgICk7IC8vIF4gcG9zaXRpb25zIGZvciB0aGUgYm90dG9tIHBhcnQgb2YgdGhlIHNoaXAuXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGVuZ3RoIC09IDE7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VhcmNoQXJvdW5kID0gbW92ZXMuc29tZSgobSkgPT4ge1xuICAgICAgbGV0IHsgY2hlY2tYIH0gPSBtO1xuICAgICAgY2hlY2tYID0gbS54O1xuICAgICAgbGV0IHsgY2hlY2tZIH0gPSBtO1xuICAgICAgY2hlY2tZID0gbS55O1xuXG4gICAgICAvLyBpZiB3ZSBhcmUgc2VhcmNoaW5nIGZvciBvdXQgb2YgZ2FtZWJvYXJkIGJvcmRlciBqdXN0IHNraXBcbiAgICAgIGlmIChjaGVja1ggPCAwIHx8IGNoZWNrWCA+IDkgfHwgY2hlY2tZIDwgMCB8fCBjaGVja1kgPiA5KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZ2FtZWJvYXJkW2NoZWNrWF1bY2hlY2tZXSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBgJHt0aGlzLmdhbWVib2FyZFtjaGVja1hdW2NoZWNrWV19ICR7Y2hlY2tYfSAvICR7Y2hlY2tZfSBGSUxMRURgXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyByZXR1cm4gdHJ1ZSBpZiB0aGVyZSBpcyBhIHNoaXAgbmVhcmJ5XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoc2VhcmNoQXJvdW5kKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZWNlaXZlQXR0YWNrKFt4LCB5XSkge1xuICAgIGNvbnN0IHhDb29yID0geDtcbiAgICBjb25zdCB5Q29vciA9IHk7XG4gICAgaWYgKHhDb29yID4gOSB8fCB4Q29vciA8IDAgfHwgeUNvb3IgPiA5IHx8IHlDb29yIDwgMCkge1xuICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgY29vcmRpbmF0ZXMnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgaGl0Q29vciA9IHRoaXMuZ2FtZWJvYXJkW3hDb29yXVt5Q29vcl07XG5cbiAgICBpZiAoaGl0Q29vciAhPT0gbnVsbCkge1xuICAgICAgbGV0IHNoaXBIaXQ7XG4gICAgICBpZiAoaGl0Q29vciA9PT0gJ0NhcicpIHtcbiAgICAgICAgc2hpcEhpdCA9ICdDYXJyaWVyJztcbiAgICAgIH0gZWxzZSBpZiAoaGl0Q29vciA9PT0gJ0JhdCcpIHtcbiAgICAgICAgc2hpcEhpdCA9ICdCYXR0bGVzaGlwJztcbiAgICAgIH0gZWxzZSBpZiAoaGl0Q29vciA9PT0gJ0RlcycpIHtcbiAgICAgICAgc2hpcEhpdCA9ICdEZXN0cm95ZXInO1xuICAgICAgfSBlbHNlIGlmIChoaXRDb29yID09PSAnU3ViJykge1xuICAgICAgICBzaGlwSGl0ID0gJ1N1Ym1hcmluZSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzaGlwSGl0ID0gJ1BhdHJvbEJvYXQnO1xuICAgICAgfVxuXG4gICAgICBzaGlwSGl0ID0gdGhpcy5nZXRTaGlwKHNoaXBIaXQpO1xuICAgICAgbGV0IGNvdW50ZXIgPSAxO1xuICAgICAgc2hpcEhpdC5sZW5ndGguc29tZSgocG9zKSA9PiB7XG4gICAgICAgIGlmIChwb3NbMF0gPT09IHhDb29yICYmIHBvc1sxXSA9PT0geUNvb3IpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pOyAvLyBeIGZpbmQgd2hpY2ggcG9zaXRpb24gd2UgYXJlIGhpdHRpbmcgdGhlIHNoaXAgZnJvbVxuICAgICAgc2hpcEhpdC5oaXQoY291bnRlcik7XG4gICAgICB0aGlzLmdhbWVib2FyZFt4Q29vcl1beUNvb3JdID0gJ2hpdCc7IC8vIHVwZGF0ZSBnYW1lYm9hcmQgdG8gZGlzcGxheSAnaGl0J1xuXG4gICAgICBjb25zb2xlLmxvZyhgaGl0dGluZyAke3NoaXBIaXQuc2hpcENsYXNzfSBmcm9tIHBvc2l0aW9uICR7Y291bnRlcn1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB0aGlzLm1pc3NlZFNob3RzLnB1c2goW3hDb29yLCB5Q29vcl0pOyAvLyBraW5kIG9mIGZvcmdvdCBhYm91dCB0aGlzLCB0aGlzIGlzIG5vdCBiZWlnbiB1c2VkXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5taXNzZWRTaG90cyk7XG4gICAgY29uc29sZS5sb2coJ2hpdCBtaXNzZWQnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjaGVja0FsbFNoaXBzU3VuaygpIHtcbiAgICBjb25zdCBzaGlwcyA9IHRoaXMuc2hpcHM7XG5cbiAgICBjb25zdCBBbGxTaGlwc0NoZWNrID0gc2hpcHMuZXZlcnkoKHNoaXApID0+IHtcbiAgICAgIGlmIChzaGlwLmlzU3VuayA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICBpZiAoQWxsU2hpcHNDaGVjayA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldFNoaXAoc2hpcCkge1xuICAgIGNvbnN0IGFsbFNoaXBzID0gdGhpcy5zaGlwcztcblxuICAgIGNvbnN0IGZpbmRTaGlwID0gKGVsZW1lbnQpID0+IGVsZW1lbnQuc2hpcENsYXNzID09PSBzaGlwO1xuICAgIGNvbnN0IGNoZWNrU2hpcEV4aXN0cyA9IGFsbFNoaXBzLmZpbmQoZmluZFNoaXApO1xuICAgIGlmIChjaGVja1NoaXBFeGlzdHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gY29uc29sZS5sb2coJ25vIHN1Y2ggc2hpcCcpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2tTaGlwRXhpc3RzO1xuICB9XG5cbiAgcmVtb3ZlU2hpcChzaGlwKSB7XG4gICAgY29uc3Qgc2hpcFRvQmVSZW1vdmVkID0gdGhpcy5nZXRTaGlwKHNoaXApO1xuICAgIGNvbnN0IHBvc2l0aW9uc09mVGhlU2hpcCA9IHNoaXBUb0JlUmVtb3ZlZC5sZW5ndGg7XG5cbiAgICBwb3NpdGlvbnNPZlRoZVNoaXAuZm9yRWFjaCgocG9zKSA9PiB7XG4gICAgICB0aGlzLmdhbWVib2FyZFtwb3NbMF1dW3Bvc1sxXV0gPSBudWxsO1xuICAgIH0pO1xuICAgIHRoaXMuc2hpcHMuc3BsaWNlKHRoaXMuc2hpcHMuaW5kZXhPZihzaGlwVG9CZVJlbW92ZWQpLCAxKTsgLy8gcmVtb3ZlIHRoZSBzaGlwXG4gIH1cbn1cblxuLy8gY29uc3QgZ2FtZWJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuLy8gZ2FtZWJvYXJkLnBsYWNlU2hpcCgnQ2FycmllcicsIFswLCAwXSwgJ2hvcicpO1xuLy8gZ2FtZWJvYXJkLnBsYWNlU2hpcCgnQmF0dGxlc2hpcCcsIFs2LCAyXSwgJ3ZlcicpO1xuLy8gZ2FtZWJvYXJkLnBsYWNlU2hpcCgnRGVzdHJveWVyJywgWzIsIDFdLCAndmVyJyk7XG4vLyBnYW1lYm9hcmQucGxhY2VTaGlwKCdTdWJtYXJpbmUnLCBbNSwgNl0sICd2ZXInKTtcbi8vIGdhbWVib2FyZC5wbGFjZVNoaXAoJ1BhdHJvbEJvYXQnLCBbOCwgOV0sICd2ZXInKTtcblxuLy8gZ2FtZWJvYXJkLnBsYWNlU2hpcCgnU3VibWFyaW5lJywgWzQsIDhdLCAndmVyJyk7XG5cbi8vIC8vIC8vIGdhbWVib2FyZC5yZW1vdmVTaGlwKCdTdWJtYXJpbmUnKTtcblxuLy8gLy8gLy8gZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soWzMsIDJdKTtcblxuLy8gZ2FtZWJvYXJkLmdhbWVib2FyZC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuLy8gfSk7XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDtcbiIsImltcG9ydCBHYW1lYm9hcmQgZnJvbSAnLi9nYW1lYm9hcmQuanMnO1xuXG5jbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5wbGF5ZXJCb2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbiAgICB0aGlzLm9wcG9uZW50ID0gbnVsbDtcbiAgICB0aGlzLmFsbFNob3RzID0gW107XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLndpbm5lciA9IGZhbHNlO1xuICB9XG5cbiAgLy8gZ2V0VHVybigpIHtcbiAgLy8gICByZXR1cm4gdGhpcy5vcHBvbmVudDtcbiAgLy8gfVxuXG4gIGdldE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfVxuXG4gIGF0dGFja3MoW3gsIHldKSB7XG4gICAgaWYgKHRoaXMuY2hlY2tBbHJlYWR5U2hvdChbeCwgeV0pKSB7XG4gICAgICByZXR1cm47XG4gICAgICAvLyBpZiB0aGUgW3gsIHldIHBvc2l0aW9uIGlzIGFscmVhZHkgc2hvdCBhdCByZXR1cm4gLy8gZXhpdFxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFsbFNob3RzLnB1c2goW3gsIHldKTtcbiAgICAgIGNvbnN0IGF0dGFja09wcG9uZW50ID0gdGhpcy5vcHBvbmVudC5wbGF5ZXJCb2FyZC5yZWNlaXZlQXR0YWNrKFt4LCB5XSk7IC8vIHJldHVybnMgdHJ1ZSBpZiBzaG90IGhpdCwgZmFsc2UgaWYgaXQgZGlkbid0XG4gICAgICBjb25zdCBpc0FsbE9wcG9uZW50U2hpcHNTdW5rID1cbiAgICAgICAgdGhpcy5vcHBvbmVudC5wbGF5ZXJCb2FyZC5jaGVja0FsbFNoaXBzU3VuaygpOyAvLyByZXR1cm5zIHRydWUgaWYgYWxsIHNoaXBzIGFyZSBzdW5rLCBmYWxzZSBvdGhlcndpc2VcblxuICAgICAgaWYgKGlzQWxsT3Bwb25lbnRTaGlwc1N1bmspIHRoaXMud2lubmVyID0gdHJ1ZTtcbiAgICAgIHJldHVybiBhdHRhY2tPcHBvbmVudDtcbiAgICB9XG4gIH1cblxuICBjaGVja0FscmVhZHlTaG90KFt4LCB5XSkge1xuICAgIGNvbnN0IGNoZWNrQWxyZWFkeVNob3QgPSB0aGlzLmFsbFNob3RzLnNvbWUoKHNob3QpID0+IHtcbiAgICAgIGlmIChzaG90WzBdID09PSB4ICYmIHNob3RbMV0gPT09IHkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBpZiAoY2hlY2tBbHJlYWR5U2hvdCA9PT0gdHJ1ZSkge1xuICAgICAgY29uc29sZS5sb2coJ3Bvc2l0aW9uIGlzIGFscmVhZHkgc2hvdCBhdCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJhbmRvbU51bSgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICB9XG5cbiAgcmFuZG9tRGlyKCkge1xuICAgIGNvbnN0IG15QXJyYXkgPSBbJ3ZlcicsICdob3InXTtcbiAgICByZXR1cm4gbXlBcnJheVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBteUFycmF5Lmxlbmd0aCldO1xuICB9XG5cbiAgQUlQbGFjZVNoaXBzKCkge1xuICAgIGNvbnN0IHBsYWNlQ2FycmllciA9ICgpID0+IHtcbiAgICAgIHRoaXMucGxheWVyQm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAnQ2FycmllcicsXG4gICAgICAgIFt0aGlzLnJhbmRvbU51bSgpLCB0aGlzLnJhbmRvbU51bSgpXSxcbiAgICAgICAgdGhpcy5yYW5kb21EaXIoKVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3QgcGxhY2VCYXR0bGVzaGlwID0gKCkgPT4ge1xuICAgICAgdGhpcy5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICdCYXR0bGVzaGlwJyxcbiAgICAgICAgW3RoaXMucmFuZG9tTnVtKCksIHRoaXMucmFuZG9tTnVtKCldLFxuICAgICAgICB0aGlzLnJhbmRvbURpcigpXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBwbGFjZURlc3Ryb3llciA9ICgpID0+IHtcbiAgICAgIHRoaXMucGxheWVyQm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAnRGVzdHJveWVyJyxcbiAgICAgICAgW3RoaXMucmFuZG9tTnVtKCksIHRoaXMucmFuZG9tTnVtKCldLFxuICAgICAgICB0aGlzLnJhbmRvbURpcigpXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBwbGFjZVN1Ym1hcmluZSA9ICgpID0+IHtcbiAgICAgIHRoaXMucGxheWVyQm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAnU3VibWFyaW5lJyxcbiAgICAgICAgW3RoaXMucmFuZG9tTnVtKCksIHRoaXMucmFuZG9tTnVtKCldLFxuICAgICAgICB0aGlzLnJhbmRvbURpcigpXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBwbGFjZVBhdHJvbEJvYXQgPSAoKSA9PiB7XG4gICAgICB0aGlzLnBsYXllckJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgJ1BhdHJvbEJvYXQnLFxuICAgICAgICBbdGhpcy5yYW5kb21OdW0oKSwgdGhpcy5yYW5kb21OdW0oKV0sXG4gICAgICAgIHRoaXMucmFuZG9tRGlyKClcbiAgICAgICk7XG4gICAgfTtcblxuICAgIGNvbnN0IGFsbFNoaXBzID0gdGhpcy5wbGF5ZXJCb2FyZC5zaGlwcztcbiAgICBjb25zdCBzaGlwc1RvQWRkID0gW1xuICAgICAgJ0NhcnJpZXInLFxuICAgICAgJ0JhdHRsZXNoaXAnLFxuICAgICAgJ0Rlc3Ryb3llcicsXG4gICAgICAnU3VibWFyaW5lJyxcbiAgICAgICdQYXRyb2xCb2F0JyxcbiAgICBdO1xuXG4gICAgd2hpbGUgKGFsbFNoaXBzLmxlbmd0aCAhPT0gNSkge1xuICAgICAgYWxsU2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICBjb25zdCBzaGlwTmFtZSA9IHNoaXAuZ2V0U2hpcENsYXNzKCk7XG4gICAgICAgIGlmIChzaGlwc1RvQWRkLmluY2x1ZGVzKHNoaXBOYW1lKSkge1xuICAgICAgICAgIHNoaXBzVG9BZGQuc3BsaWNlKHNoaXBzVG9BZGQuaW5kZXhPZihzaGlwTmFtZSksIDEpOyAvLyByZW1vdmUgdGhlIHNoaXBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzaGlwc1RvQWRkLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgaWYgKHNoaXAgPT09ICdDYXJyaWVyJykge1xuICAgICAgICAgIHBsYWNlQ2FycmllcigpO1xuICAgICAgICB9IGVsc2UgaWYgKHNoaXAgPT09ICdCYXR0bGVzaGlwJykge1xuICAgICAgICAgIHBsYWNlQmF0dGxlc2hpcCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHNoaXAgPT09ICdEZXN0cm95ZXInKSB7XG4gICAgICAgICAgcGxhY2VEZXN0cm95ZXIoKTtcbiAgICAgICAgfSBlbHNlIGlmIChzaGlwID09PSAnU3VibWFyaW5lJykge1xuICAgICAgICAgIHBsYWNlU3VibWFyaW5lKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2hpcCA9PT0gJ1BhdHJvbEJvYXQnKSB7XG4gICAgICAgICAgcGxhY2VQYXRyb2xCb2F0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIEFJQXR0YWNrcygpIHtcbiAgICBjb25zdCBhdHRhY2tDb29yID0gW3RoaXMucmFuZG9tTnVtKCksIHRoaXMucmFuZG9tTnVtKCldO1xuICAgIGlmICh0aGlzLmNoZWNrQWxyZWFkeVNob3QoW2F0dGFja0Nvb3JbMF0sIGF0dGFja0Nvb3JbMV1dKSkge1xuICAgICAgY29uc29sZS5sb2coJ0FJIGlzIGdvbm5hIHJldHJ5IGhpdHRpbmcnKTtcbiAgICAgIHJldHVybiB0aGlzLkFJQXR0YWNrcygpOyAvLyBkbyBBSUF0dGFja3MgdW50aWwgQUkgaGl0cyB3aXRoIGF2YWlsYWJsZSBwb3NpdGlvblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmF0dGFja3MoYXR0YWNrQ29vcik7XG4gICAgICByZXR1cm4gYXR0YWNrQ29vcjtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY2xhc3MgU2hpcCB7XG4gIGNvbnN0cnVjdG9yKHNoaXBDbGFzcykge1xuICAgIHRoaXMuc2hpcENsYXNzID0gc2hpcENsYXNzO1xuICAgIHRoaXMubGVuZ3RoID0gdGhpcy5hc3NpZ25DbGFzc0xlbmd0aCgpO1xuICAgIHRoaXMuaXNTdW5rID0gZmFsc2U7XG4gIH1cblxuICBhc3NpZ25DbGFzc0xlbmd0aCgpIHtcbiAgICBpZiAodGhpcy5zaGlwQ2xhc3MgPT09ICdDYXJyaWVyJykge1xuICAgICAgcmV0dXJuIFsxLCAyLCAzLCA0LCA1XTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hpcENsYXNzID09PSAnQmF0dGxlc2hpcCcpIHtcbiAgICAgIHJldHVybiBbMSwgMiwgMywgNF07XG4gICAgfVxuICAgIGlmICh0aGlzLnNoaXBDbGFzcyA9PT0gJ0Rlc3Ryb3llcicpIHtcbiAgICAgIHJldHVybiBbMSwgMiwgM107XG4gICAgfVxuICAgIGlmICh0aGlzLnNoaXBDbGFzcyA9PT0gJ1N1Ym1hcmluZScpIHtcbiAgICAgIHJldHVybiBbMSwgMiwgM107XG4gICAgfVxuICAgIGlmICh0aGlzLnNoaXBDbGFzcyA9PT0gJ1BhdHJvbEJvYXQnKSB7XG4gICAgICByZXR1cm4gWzEsIDJdO1xuICAgIH1cbiAgICByZXR1cm4gY29uc29sZS5sb2coJ3NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gIH1cblxuICBnZXRMZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoLmxlbmd0aDtcbiAgfVxuXG4gIGdldFNoaXBOYW1lKCkge1xuICAgIHJldHVybiB0aGlzLnNoaXBDbGFzcy5zbGljZSgwLCAzKTtcbiAgfVxuXG4gIGdldFNoaXBDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlwQ2xhc3M7XG4gIH1cblxuICBoaXQobnVtKSB7XG4gICAgaWYgKHRoaXMubGVuZ3RoLmxlbmd0aCA+PSBudW0gJiYgbnVtID4gMCkge1xuICAgICAgdGhpcy5sZW5ndGhbbnVtIC0gMV0gPSAnaGl0JztcbiAgICAgIHRoaXMuc3VuaygpO1xuICAgIH1cbiAgfVxuXG4gIHN1bmsoKSB7XG4gICAgY29uc3QgY2hlY2tTdW5rID0gKGN1cnJlbnQpID0+IGN1cnJlbnQgPT09ICdoaXQnO1xuXG4gICAgaWYgKHRoaXMubGVuZ3RoLmV2ZXJ5KGNoZWNrU3VuaykpIHRoaXMuaXNTdW5rID0gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vY3NzL3N0eWxlLmNzcyc7XG5pbXBvcnQgJy4vaW5kZXguaHRtbCc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vY29tcG9uZW50cy9wbGF5ZXIuanMnO1xuaW1wb3J0IHsgY3JlYXRlUGxheWVyR3JpZCwgcGxhY2VTaGlwcyB9IGZyb20gJy4vY29tcG9uZW50cy9kb20tbWFuaXB1bGF0aW9uLmpzJztcblxuY29uc3QgTmV3UGxheWVyID0gUGxheWVyO1xuXG5jb25zdCBwbGF5ZXJPbmUgPSBuZXcgTmV3UGxheWVyKCdIdW1hbicpO1xuY29uc3QgcGxheWVyQUkgPSBuZXcgTmV3UGxheWVyKCdDb21wdXRlcicpO1xucGxheWVyT25lLm9wcG9uZW50ID0gcGxheWVyQUk7XG5wbGF5ZXJBSS5vcHBvbmVudCA9IHBsYXllck9uZTtcblxuY29uc3QgZ2FtZVN0YXJ0ID0ge1xuICBpbml0KCkge1xuICAgIGNyZWF0ZVBsYXllckdyaWQocGxheWVyT25lKTtcbiAgICBjcmVhdGVQbGF5ZXJHcmlkKHBsYXllckFJKTtcblxuICAgIHBsYXllckFJLkFJUGxhY2VTaGlwcygpO1xuICAgIC8vIHRoaXMuQUlVcGRhdGVEaXNwbGF5KHBsYXllckFJKTsgLy8gaWYgeW91IHdhbnQgdG8gdmlzdWFsaXplIEFJJ3Mgc2hpcHNcbiAgfSxcblxuICBwbGF5ZXJQbGFjZVNoaXAocGxheWVyLCBzaGlwQ2xhc3MsIFt4LCB5XSwgZGlyKSB7XG4gICAgY29uc3QgcGxheWVyR2FtZWJvYXJkID0gcGxheWVyLnBsYXllckJvYXJkO1xuICAgIGNvbnN0IHNoaXBQbGFjZWQgPSBzaGlwQ2xhc3M7XG4gICAgY29uc3QgcG9zMCA9IHg7XG4gICAgY29uc3QgcG9zMSA9IHk7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gZGlyO1xuXG4gICAgaWYgKFxuICAgICAgcGxheWVyR2FtZWJvYXJkLnBsYWNlU2hpcChzaGlwUGxhY2VkLCBbcG9zMCwgcG9zMV0sIGRpcmVjdGlvbikgPT09IGZhbHNlXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyBwbGFjZSB0aGUgc2hpcCBpbiBwbGF5ZXJzIGdhbWVib2FyZCAvLyBpZiBmYWxzZSBpcyByZXR1cm5lZCB0aGVuIGV4aXQsIHNvbWV0aGluZyB3ZW50IHdyb25nXG5cbiAgICBjb25zdCBzaGlwID0gcGxheWVyR2FtZWJvYXJkLmdldFNoaXAoc2hpcFBsYWNlZCk7IC8vIHN0b3JlIHRoZSBzaGlwXG4gICAgcGxhY2VTaGlwcyhwbGF5ZXJPbmUsIHNoaXApO1xuICB9LFxuXG4gIEFJVXBkYXRlRGlzcGxheShwbGF5ZXJBSSkge1xuICAgIGNvbnN0IEFJU2hpcHMgPSBwbGF5ZXJBSS5wbGF5ZXJCb2FyZC5zaGlwcztcblxuICAgIEFJU2hpcHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgcGxhY2VTaGlwcyhwbGF5ZXJBSSwgc2hpcCk7XG4gICAgfSk7XG4gIH0sXG59O1xuXG4vLyBjb25zdCBnYW1lTG9vcCA9ICgpID0+IHt9O1xuXG5nYW1lU3RhcnQuaW5pdCgpO1xuXG5nYW1lU3RhcnQucGxheWVyUGxhY2VTaGlwKHBsYXllck9uZSwgJ0NhcnJpZXInLCBbMCwgMF0sICdob3InKTtcbmdhbWVTdGFydC5wbGF5ZXJQbGFjZVNoaXAocGxheWVyT25lLCAnQmF0dGxlc2hpcCcsIFsxLCA3XSwgJ3ZlcicpO1xuZ2FtZVN0YXJ0LnBsYXllclBsYWNlU2hpcChwbGF5ZXJPbmUsICdEZXN0cm95ZXInLCBbNSwgNF0sICd2ZXInKTtcbmdhbWVTdGFydC5wbGF5ZXJQbGFjZVNoaXAocGxheWVyT25lLCAnU3VibWFyaW5lJywgWzMsIDFdLCAndmVyJyk7XG5nYW1lU3RhcnQucGxheWVyUGxhY2VTaGlwKHBsYXllck9uZSwgJ1BhdHJvbEJvYXQnLCBbNCwgOV0sICd2ZXInKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==