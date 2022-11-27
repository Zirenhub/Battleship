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
  // to remove its eventListeners.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSw4RUFBOEU7QUFDOUU7QUFDQSx1REFBdUQ7O0FBRXZEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQ7QUFDOUQ7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQixNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRUFBZSxNQUFNLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQy9JdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsSUFBSSxFQUFDOzs7Ozs7O1VDcERwQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTnlCO0FBQ0g7QUFDc0I7QUFDb0M7O0FBRWhGLGtCQUFrQiw2REFBTTs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUksaUZBQWdCO0FBQ3BCLElBQUksaUZBQWdCOztBQUVwQjtBQUNBLHVDQUF1QztBQUN2QyxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU4sc0RBQXNEO0FBQ3RELElBQUksMkVBQVU7QUFDZCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLDJFQUFVO0FBQ2hCLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguaHRtbCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Nzcy9zdHlsZS5jc3M/MGE0OCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXBvbmVudHMvZG9tLW1hbmlwdWxhdGlvbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXBvbmVudHMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY29tcG9uZW50cy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jb21wb25lbnRzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE1vZHVsZVxudmFyIGNvZGUgPSBcIjwhRE9DVFlQRSBodG1sPlxcbjxodG1sPlxcblxcbjxoZWFkPlxcbiAgICA8bWV0YSBjaGFyc2V0PVxcXCJ1dGYtOFxcXCI+XFxuICAgIDxtZXRhIGh0dHAtZXF1aXY9XFxcIlgtVUEtQ29tcGF0aWJsZVxcXCIgY29udGVudD1cXFwiSUU9ZWRnZVxcXCI+XFxuICAgIDx0aXRsZT5CYXR0bGVzaGlwPC90aXRsZT5cXG4gICAgPG1ldGEgbmFtZT1cXFwiZGVzY3JpcHRpb25cXFwiIGNvbnRlbnQ9XFxcIlxcXCI+XFxuICAgIDxtZXRhIG5hbWU9XFxcInZpZXdwb3J0XFxcIiBjb250ZW50PVxcXCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MVxcXCI+XFxuPC9oZWFkPlxcblxcbjxib2R5PlxcbiAgICA8bWFpbiBjbGFzcz1cXFwibWFpbi1jb250YWluZXJcXFwiPlxcbiAgICAgICAgPGgxPkJhdHRsZXNoaXA8L2gxPlxcblxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicGxheWVycy1jb250YWluZXJcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInBsYXllci1vbmUtY29udGFpbmVyXFxcIj5cXG5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwbGF5ZXItdHdvLWNvbnRhaW5lclxcXCI+XFxuXFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgIDxkaXYgaWQ9XFxcImhpbnRDb250YWluZXJcXFwiPlxcbiAgICAgICAgICAgIDxwPkhpbnQ6IENsaWNrIG9uIGFueSBvbmUgb2YgeW91ciBzaGlwcyB0byByZWxvY2F0ZSBpdDwvcD5cXG4gICAgICAgICAgICA8cD5IaW50OiBXaGlsZSBzZWFyY2hpbmcgZm9yIGEgbmV3IHBvc2l0aW9uIGZvciB5b3VyIHNoaXAsIHByZXNzIFIgdG8gcm90YXRlIGl0PC9wPlxcbiAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICA8IS0tIDxkaXYgY2xhc3M9XFxcImhlbHAtaW5zdFxcXCI+XFxuICAgICAgICAgICAgPHA+Q2FycmllcjwvcD5cXG4gICAgICAgICAgICA8cD5CYXR0bGVzaGlwPC9wPlxcbiAgICAgICAgICAgIDxwPkRlc3Ryb3llcjwvcD5cXG4gICAgICAgICAgICA8cD5TdWJtYXJpbmU8L3A+XFxuICAgICAgICAgICAgPHA+UGF0cm9sIEJvYXQ8L3A+XFxuICAgICAgICA8L2Rpdj4gLS0+XFxuICAgIDwvbWFpbj5cXG48L2JvZHk+XFxuXFxuPC9odG1sPlwiO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgY29kZTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJjb25zdCBwbGF5ZXJPbmVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLW9uZS1jb250YWluZXInKTtcbmNvbnN0IHBsYXllclR3b0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItdHdvLWNvbnRhaW5lcicpO1xuY29uc3QgY29udGVudFBhcmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLWNvbnRhaW5lcicpO1xuXG5jb25zdCBnZXRQbGF5ZXJDb250YWluZXIgPSAodGhpc1BsYXllcikgPT4ge1xuICBsZXQgY3VycmVudFBsYXllckNvbnRhaW5lcjtcbiAgaWYgKHRoaXNQbGF5ZXIuZ2V0TmFtZSgpICE9PSAnQ29tcHV0ZXInKSB7XG4gICAgY3VycmVudFBsYXllckNvbnRhaW5lciA9IHBsYXllck9uZUNvbnRhaW5lcjtcbiAgfSBlbHNlIGlmICh0aGlzUGxheWVyLmdldE5hbWUoKSA9PT0gJ0NvbXB1dGVyJykge1xuICAgIGN1cnJlbnRQbGF5ZXJDb250YWluZXIgPSBwbGF5ZXJUd29Db250YWluZXI7XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRQbGF5ZXJDb250YWluZXI7XG59O1xuXG5jb25zdCBkZWNsYXJlV2lubmVyID0gKHBsYXllcikgPT4ge1xuICBsZXQgd2lubmVyQ29uZ3JhdHNUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHdpbm5lckNvbmdyYXRzVGV4dC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3dpbm5lckNvbmdyYXRzJyk7XG4gIHdpbm5lckNvbmdyYXRzVGV4dC50ZXh0Q29udGVudCA9IGBDb25ncmF0cyAke3BsYXllci5nZXROYW1lKCl9IHdvbiB0aGUgZ2FtZSFgO1xuICBjb250ZW50UGFyZW50LmFwcGVuZENoaWxkKHdpbm5lckNvbmdyYXRzVGV4dCk7XG59O1xuXG5jb25zdCBBSUF0dGFja3NET00gPSAodGhpc1BsYXllcikgPT4ge1xuICBjb25zb2xlLmxvZyh0aGlzUGxheWVyKTtcbiAgY29uc3QgQUlBdHRhY2tDb29yZHMgPSB0aGlzUGxheWVyLkFJQXR0YWNrcygpO1xuICBjb25zdCBkYXRhSUQgPSBgJHtBSUF0dGFja0Nvb3Jkc1swXX0gJHtBSUF0dGFja0Nvb3Jkc1sxXX1gO1xuICBjb25zdCBjZWxsID0gcGxheWVyT25lQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3I9JyR7ZGF0YUlEfSddYCk7XG4gIGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnY2VsbCcpO1xuICAvLyBvbmx5IHRoZSBodW1hbidzIHNoaXBzIGhhdmUgaWQgdG8gdmlzdWFsaXplIHRoZW0gaW4gdGhlIGJvYXJkIHdpdGggZGlmZmVyZW50IGNvbG9yc1xuICBpZiAoY2VsbC5oYXNBdHRyaWJ1dGUoJ2lkJykpIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICB9IGVsc2Uge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnbWlzc2VkJyk7XG4gIH1cbn07XG5cbmNvbnN0IHJlY2lldmVBdHRhY2sgPSAoZGlzcGxheUNlbGwsIGFycmF5Rm9ybWF0LCB0aGlzUGxheWVyKSA9PiB7XG4gIGRpc3BsYXlDZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2NlbGwnKTtcbiAgY29uc3QgcGxheWVyT25lQXR0YWNrcyA9IHRoaXNQbGF5ZXIub3Bwb25lbnQuYXR0YWNrcyhhcnJheUZvcm1hdCk7XG4gIC8vIHdoZW4gd2UgY2xpY2sgb24gcGxheWVyVHdvJ3MgYm9hcmQgcGxheWVyVHdvJ3Mgb3Bwb25lbnQgYXR0YWNrcy5cbiAgaWYgKHBsYXllck9uZUF0dGFja3MgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSAvLyB1bmRlZmluZWQgaXMgcmV0dXJuZWQgd2hlbiB0aGUgcG9zaXRpb24gaXMgYWxyZWFkeSBzaG90XG5cbiAgaWYgKHBsYXllck9uZUF0dGFja3MpIHtcbiAgICBkaXNwbGF5Q2VsbC5jbGFzc0xpc3QuYWRkKCdoaXQnKTtcbiAgfSBlbHNlIHtcbiAgICBkaXNwbGF5Q2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzZWQnKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcblxuICAvLyBub3cgaXQncyBBSSdzIHR1cm4gdG8gYXR0YWNrXG59O1xuXG5jb25zdCBjcmVhdGVQbGF5ZXJHcmlkID0gKHBsYXllcikgPT4ge1xuICBjb25zdCB0aGlzUGxheWVyID0gcGxheWVyO1xuICBjb25zdCBhcnJheUdyaWQgPSB0aGlzUGxheWVyLnBsYXllckJvYXJkLmdhbWVib2FyZDtcbiAgY29uc3QgcGxheWVyQ29udGFpbmVyID0gZ2V0UGxheWVyQ29udGFpbmVyKHRoaXNQbGF5ZXIpO1xuXG4gIGlmIChwbGF5ZXJDb250YWluZXIgPT09IHBsYXllclR3b0NvbnRhaW5lcikge1xuICAgIGFycmF5R3JpZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICByb3cuZm9yRWFjaCgoY2VsbCwgY2VsbEluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGRpc3BsYXlDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRpc3BsYXlDZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgZGlzcGxheUNlbGwuZGF0YXNldC5jb29yID0gYCR7cm93SW5kZXh9ICR7Y2VsbEluZGV4fWA7XG4gICAgICAgIGNvbnN0IGFycmF5Rm9ybWF0ID0gW3Jvd0luZGV4LCBjZWxsSW5kZXhdO1xuICAgICAgICBkaXNwbGF5Q2VsbC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICdjbGljaycsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB0aGlzUGxheWVyLndpbm5lciA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgICB0aGlzUGxheWVyLm9wcG9uZW50Lndpbm5lciA9PT0gdHJ1ZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWNpZXZlQXR0YWNrKGRpc3BsYXlDZWxsLCBhcnJheUZvcm1hdCwgdGhpc1BsYXllcikgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIEFJQXR0YWNrc0RPTSh0aGlzUGxheWVyKTtcbiAgICAgICAgICAgICAgLy8gXiBmYWxzZSB3aWxsIG9ubHkgYmUgcmV0dXJuZWQgaWYgcGxheWVyT25lIGF0dGFjayBpcyB1bmRlZmluZWQgd2hpY2ggbWVhbnMgcG9zIGlzIGFscmVhZHkgc2hvdCxcbiAgICAgICAgICAgICAgLy8gaW4gd2hpY2ggY2FzZSBBSSBkb2Vzbid0IGF0dGFjayBhbmQgd2Ugd2FpdCBmb3IgcGxheWVyIHRvIGNsaWNrIG9uIGEgdGlsZSB0aGF0IGhhc24ndCBiZWVuIHNob3RcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzUGxheWVyLndpbm5lciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICBkZWNsYXJlV2lubmVyKHRoaXNQbGF5ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXNQbGF5ZXIub3Bwb25lbnQud2lubmVyID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIGRlY2xhcmVXaW5uZXIodGhpc1BsYXllci5vcHBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICBwbGF5ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoZGlzcGxheUNlbGwpO1xuICAgICAgfSk7XG4gICAgfSk7IC8vIGFkZGluZyBldmVudGxpc3RlbmVyIGZvciBwbGF5ZXJUd29Db250YWluZXIgc2luY2UgdGhpcyBpcyB0aGUgY29udGFpbmVyIHRoYXQgdGhlIGh1bWFuIHBsYXllciB3aWxsIGJlIGF0dGFja2luZ1xuICB9IGVsc2Uge1xuICAgIGFycmF5R3JpZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICByb3cuZm9yRWFjaCgoY2VsbCwgY2VsbEluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGRpc3BsYXlDZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRpc3BsYXlDZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgZGlzcGxheUNlbGwuZGF0YXNldC5jb29yID0gYCR7cm93SW5kZXh9ICR7Y2VsbEluZGV4fWA7XG4gICAgICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXNwbGF5Q2VsbCk7XG4gICAgICB9KTtcbiAgICB9KTsgLy8gdGhpcyBpcyB0aGUgcGxheWVyT25lQ29udGFpbmVyXG4gIH1cblxuICBwbGF5ZXJDb250YWluZXIuc3R5bGUuZ3JpZFRlbXBsYXRlQ29sdW1ucyA9IGByZXBlYXQoJHthcnJheUdyaWQubGVuZ3RofSwgYXV0bylgO1xuICBwbGF5ZXJDb250YWluZXIuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoJHthcnJheUdyaWQubGVuZ3RofSwgYXV0bylgO1xufTtcblxuY29uc3QgYWRkSG92ZXJFZmZlY3QgPSAobGVuZ3RoLCBwbGFjZUNlbGwsIGRpcmVjdGlvbikgPT4ge1xuICBjb25zdCBzaGlwTGVuZ3RoID0gbGVuZ3RoO1xuXG4gIGNvbnN0IGRhdGFJRCA9IHBsYWNlQ2VsbC5kYXRhc2V0LmNvb3I7XG4gIGlmIChkYXRhSUQgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB4UG9zID0gTnVtYmVyKGRhdGFJRFswXSk7XG4gIGxldCB5UG9zID0gTnVtYmVyKGRhdGFJRFsyXSk7IC8vIGRhdGFJRFsxXSBpcyBlbXB0eSBzcGFjZVxuXG4gIGxldCBzZWxlY3RlZENlbGwgPSBwbGF5ZXJPbmVDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICBgW2RhdGEtY29vcj0nJHt4UG9zfSAke3lQb3N9J11gXG4gICk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZGlyZWN0aW9uID09PSAndmVyJykge1xuICAgICAgc2VsZWN0ZWRDZWxsID0gcGxheWVyT25lQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbZGF0YS1jb29yPScke3hQb3MrK30gJHt5UG9zfSddYFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcicpIHtcbiAgICAgIHNlbGVjdGVkQ2VsbCA9IHBsYXllck9uZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEtY29vcj0nJHt4UG9zfSAke3lQb3MrK30nXWBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdGVkQ2VsbCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNlbGVjdGVkQ2VsbC5jbGFzc0xpc3QuYWRkKCdwbGFjaW5nJyk7XG4gIH1cbn07XG5cbmNvbnN0IHBsYXllck1vdmVTaGlwID0gKHNoaXBMZW5ndGgsIHNoaXBQbGFjZWQsIHBsYXllcikgPT4ge1xuICBpZiAocGxheWVyLmFsbFNob3RzLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfSAvLyBpZiBnYW1lIHN0YXJ0ZWQgLy8gZmlyc3Qgc2hvdCB3YXMgZmlyZWQsIHRoZW4gZXhpdCwgcGxheWVyIGlzIG5vdCBhbGxvd2VkIHRvIG1vdmUgc2hpcHNcblxuICBsZXQgZGlyZWN0aW9uID0gJ3Zlcic7XG5cbiAgY29uc3QgY2hhbmdlSG92ZXJEaXJlY3Rpb24gPSAoZSkgPT4ge1xuICAgIGlmIChlLmtleSA9PT0gJ3InKSB7XG4gICAgICBkaXJlY3Rpb24gPT09ICd2ZXInID8gKGRpcmVjdGlvbiA9ICdob3InKSA6IChkaXJlY3Rpb24gPSAndmVyJyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IF9wbGFjZUxpc3RlbmVyID0gKHBsYWNlQ2VsbCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IHBsYWNlQ2VsbC50YXJnZXQ7XG4gICAgY29uc3Qgc2hpcCA9IHNoaXBQbGFjZWQ7XG4gICAgaWYgKG5ld1NoaXBQb3ModGFyZ2V0LCBzaGlwLCBwbGF5ZXIsIGRpcmVjdGlvbikpIHtcbiAgICAgIHBsYXllck9uZUNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGNoYW5nZUhvdmVyRGlyZWN0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgX2hvdmVyTGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgIGNvbnN0IHBsYWNlQ2VsbCA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IGxlbmd0aCA9IHNoaXBMZW5ndGg7XG4gICAgYWRkSG92ZXJFZmZlY3QobGVuZ3RoLCBwbGFjZUNlbGwsIGRpcmVjdGlvbik7XG5cbiAgICBwbGFjZUNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfcGxhY2VMaXN0ZW5lcik7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlSG92ZXJFZmZlY3QgPSAoKSA9PiB7XG4gICAgY29uc3QgY2VsbHMgPSBwbGF5ZXJPbmVDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLmNlbGwnKTtcbiAgICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ3BsYWNpbmcnKTtcbiAgICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfcGxhY2VMaXN0ZW5lcik7XG4gICAgfSk7XG4gIH07XG5cbiAgaWYgKHBsYXllck9uZUNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVycykge1xuICAgIHBsYXllck9uZUNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgcGxheWVyT25lQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIF9ob3Zlckxpc3RlbmVyKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGNoYW5nZUhvdmVyRGlyZWN0aW9uKTtcblxuICBwbGF5ZXJPbmVDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgcGxheWVyT25lQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIF9ob3Zlckxpc3RlbmVyKTtcbiAgICByZW1vdmVIb3ZlckVmZmVjdCgpO1xuICB9O1xuXG4gIC8vIHJlbW92ZSB0aGUgaG92ZXIgZWZmZWN0IG9uIGNlbGxzIGFmdGVyIG1vdXNlb3V0XG4gIHBsYXllck9uZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHJlbW92ZUhvdmVyRWZmZWN0KTtcbn07XG5cbmNvbnN0IHJlbW92ZU9sZFNoaXBQb3MgPSAob2xkU2hpcFBvc0FycmF5KSA9PiB7XG4gIGNvbnN0IHBvc2l0aW9uc1RvUmVtb3ZlID0gb2xkU2hpcFBvc0FycmF5O1xuICBwb3NpdGlvbnNUb1JlbW92ZS5mb3JFYWNoKChwb3MpID0+IHtcbiAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtY29vcj0nJHtwb3NbMF19ICR7cG9zWzFdfSddYCk7XG4gICAgY2VsbC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgY29uc3QgY2xvbmUgPSBjZWxsLmNsb25lTm9kZShmYWxzZSk7XG4gICAgY2VsbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChjbG9uZSwgY2VsbCk7XG4gIH0pO1xuICAvLyBjbGVhbmluZyBvbGQgcG9zaXRpb25zIG9mIHRoZSByZWxvY2F0ZWQgc2hpcCwgcmVtb3ZpbmcgaXRzIGlkIGFuZCByZXBsYWNpbmcgaXQgd2l0aCBhIG5vZGUgY2xvbmUsXG4gIC8vIHRvIHJlbW92ZSBpdHMgZXZlbnRMaXN0ZW5lcnMuXG59O1xuXG5jb25zdCBuZXdTaGlwUG9zID0gKHRhcmdldCwgc2hpcCwgcGxheWVyLCBkaXJlY3Rpb24pID0+IHtcbiAgY29uc3QgdGFyZ2V0Q2VsbCA9IHRhcmdldC5kYXRhc2V0LmNvb3I7XG4gIGNvbnN0IHRhcmdldFNoaXAgPSBzaGlwLmdldFNoaXBDbGFzcygpO1xuICBjb25zdCBwb3MgPSBbTnVtYmVyKHRhcmdldENlbGxbMF0pLCBOdW1iZXIodGFyZ2V0Q2VsbFsyXSldO1xuXG4gIGNvbnN0IG9sZFNoaXBQb3NBcnJheSA9IFtdO1xuXG4gIGNvbnN0IGdldFNoaXAgPSBwbGF5ZXIucGxheWVyQm9hcmQuZ2V0U2hpcCh0YXJnZXRTaGlwKTsgLy8gc3RvcmUgdGhlIG9sZCBzaGlwXG4gIGNvbnN0IG9sZFNoaXBQb3NpdGlvbnMgPSBnZXRTaGlwLmxlbmd0aDtcbiAgb2xkU2hpcFBvc2l0aW9ucy5mb3JFYWNoKChwb3MpID0+IHtcbiAgICBvbGRTaGlwUG9zQXJyYXkucHVzaChwb3MpO1xuICB9KTtcblxuICBsZXQgbmV3U2hpcFBvcztcblxuICBpZiAoZGlyZWN0aW9uID09PSAndmVyJykge1xuICAgIG5ld1NoaXBQb3MgPSBwbGF5ZXIucGxheWVyQm9hcmQucGxhY2VTaGlwKHRhcmdldFNoaXAsIHBvcywgJ3ZlcicpO1xuICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcicpIHtcbiAgICBuZXdTaGlwUG9zID0gcGxheWVyLnBsYXllckJvYXJkLnBsYWNlU2hpcCh0YXJnZXRTaGlwLCBwb3MsICdob3InKTtcbiAgfVxuXG4gIGlmIChuZXdTaGlwUG9zICE9PSBmYWxzZSkge1xuICAgIHJlbW92ZU9sZFNoaXBQb3Mob2xkU2hpcFBvc0FycmF5KTtcbiAgICBwbGFjZVNoaXBzKHBsYXllciwgZ2V0U2hpcCk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBwbGFjZVNoaXBzID0gKHBsYXllciwgc2hpcCkgPT4ge1xuICBjb25zdCBzaGlwUGxhY2VkID0gc2hpcDtcbiAgY29uc3QgcGxheWVyQ29udGFpbmVyID0gZ2V0UGxheWVyQ29udGFpbmVyKHBsYXllcik7XG4gIGxldCBzaGlwTmFtZSA9IHNoaXAuc2hpcENsYXNzO1xuICBjb25zdCBzaGlwUG9zaXRpb25zID0gc2hpcFBsYWNlZC5sZW5ndGg7IC8vIGdldCB0aGUgbGVuZ3RoIG9mIHRoZSBzaGlwIC8vIGxlbmd0aCBpcyBhbHNvIGFycmF5IG9mIHRoZSBwb3NpdGlvbnMgYXMgaW4gWzMsIDVdIGV0Yy5cbiAgY29uc3Qgc2hpcExlbmd0aCA9IHNoaXBQbGFjZWQubGVuZ3RoLmxlbmd0aDtcblxuICBzaGlwUG9zaXRpb25zLmZvckVhY2goKHBvcykgPT4ge1xuICAgIGNvbnN0IHhQb3MgPSBwb3NbMF07IC8vIHN0b3JlIHRoZSBmaXJzdCBjb29yZGluYXRlIGV4cDogWzMsIDVdIHN0b3JlIDNcbiAgICBjb25zdCB5UG9zID0gcG9zWzFdOyAvLyBzdG9yZSB0aGUgc2Vjb25kIGNvb3JkaW5hdGVcbiAgICBjb25zdCBkYXRhSUQgPSBgJHt4UG9zfSAke3lQb3N9YDsgLy8gc3RvcmUgYm90aCBvZiB0aGUgY29vcmRpbmF0ZXMgaW50byBhIHN0cmluZyBleHA6IDMgNVxuXG4gICAgY29uc3QgY2hpbGQgPSBwbGF5ZXJDb250YWluZXIucXVlcnlTZWxlY3RvcihgW2RhdGEtY29vcj0nJHtkYXRhSUR9J11gKTsgLy8gXiBzdG9yZSB0aGUgY2hpbGQgZGl2IG9mIHRoZSBwbGF5ZXJDb250YWluZXIgd2l0aCB0aGUgY3VycmVudCBkYXRhSURcbiAgICBjaGlsZC5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7c2hpcE5hbWV9YCk7IC8vIHNldCB0aGUgZGl2J3MgaWQgd2l0aCB0aGUgbmFtZSBvZiB0aGUgc2hpcCBiZWluZyBwbGFjZWRcbiAgICBjaGlsZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+XG4gICAgICBwbGF5ZXJNb3ZlU2hpcChzaGlwTGVuZ3RoLCBzaGlwUGxhY2VkLCBwbGF5ZXIpXG4gICAgKTtcbiAgfSk7XG4gIC8vIG1vc3QgbGlrZWx5IG5vdCB0aGUgYmVzdCB3YXkgb2YgZG9pbmcgdGhpcywgYnV0IHRoZSBvbmx5IHNvbHV0aW9uIGkgY2FuIHRoaW5rIG9mIPCfmJVcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZVBsYXllckdyaWQsIHBsYWNlU2hpcHMgfTtcbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcC5qcyc7XG5cbmNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZ2FtZWJvYXJkID0gdGhpcy5jb25zdHJ1Y3Rvci5jcmVhdGVHYW1lYm9hcmQoKTtcbiAgICB0aGlzLnNoaXBzID0gW107XG4gICAgdGhpcy5taXNzZWRTaG90cyA9IFtdOyAvLyBmb3Jnb3QgYWJvdXQgdGhpcyBhbmQgZGlkbid0IHVzZSBpdCB0byB2aXN1YWxpemUgbWlzc2VkIGhpdHNcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVHYW1lYm9hcmQoKSB7XG4gICAgY29uc3QgYm9hcmQgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkgKz0gMSkge1xuICAgICAgYm9hcmRbaV0gPSBbXTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGogKz0gMSkge1xuICAgICAgICBib2FyZFtpXVtqXSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBib2FyZDtcbiAgfVxuXG4gIHBsYWNlU2hpcChzLCBbeCwgeV0sIGRpcikge1xuICAgIGxldCBuZXdTaGlwO1xuXG4gICAgY29uc3QgY2hlY2tTaGlwRXhpc3RzID0gdGhpcy5nZXRTaGlwKHMpO1xuICAgIGlmICghIWNoZWNrU2hpcEV4aXN0cykge1xuICAgICAgbmV3U2hpcCA9IGNoZWNrU2hpcEV4aXN0cztcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3U2hpcCA9IG5ldyBTaGlwKHMpO1xuICAgIH0gLy8gaWYgdGhlIHNoaXAgd2UgYXJlIGdpdmVuIGV4aXN0cyB0aGVuIHNlbGVjdCB0aGF0IHNoaXAsIHdlIGFyZSByZWxvY2F0aW5nIGl0LCBlbHNlIGNyZWF0ZSBhIG5ldyBvbmVcblxuICAgIGxldCB4Q29vciA9IHg7XG4gICAgbGV0IHlDb29yID0geTtcblxuICAgIGNvbnN0IGRpcmVjdGlvbiA9IGRpcjtcbiAgICBpZiAoZGlyZWN0aW9uICE9PSAndmVyJyAmJiBkaXJlY3Rpb24gIT09ICdob3InKSB7XG4gICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBkaXJlY3Rpb24gb25seSBcInZlclwiIG9yIFwiaG9yXCInKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgc2hpcExlbmd0aCA9IG5ld1NoaXAuZ2V0TGVuZ3RoKCk7IC8vIGdpdmVzIHRoZSBsZW5ndGggb2YgdGhlIHNoaXAsIGFzIGluIGxlbmd0aCBvZiB0aGUgYXJyYXlcblxuICAgIGlmIChkaXJlY3Rpb24gPT09ICd2ZXInKSB7XG4gICAgICBpZiAoeUNvb3IgPCAwIHx8IHlDb29yID4gOSkge1xuICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBZIGNvb3JkaW5hdGVzJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh4Q29vciAtIDEgKyBzaGlwTGVuZ3RoID4gOSB8fCB4Q29vciA8IDApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgWCBjb29yZGluYXRlcycpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdob3InKSB7XG4gICAgICBpZiAoeUNvb3IgLSAxICsgc2hpcExlbmd0aCA+IDkgfHwgeUNvb3IgPCAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIFkgY29vcmRpbmF0ZXMnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHhDb29yIDwgMCB8fCB4Q29vciA+IDkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgWCBjb29yZGluYXRlcycpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdGVtcFBvc2l0aW9ucyA9IFtdO1xuXG4gICAgaWYgKCEhY2hlY2tTaGlwRXhpc3RzKSB7XG4gICAgICBuZXdTaGlwLmxlbmd0aC5mb3JFYWNoKChwb3MpID0+IHtcbiAgICAgICAgdGVtcFBvc2l0aW9ucy5wdXNoKHBvcyk7XG4gICAgICAgIHRoaXMuZ2FtZWJvYXJkW3Bvc1swXV1bcG9zWzFdXSA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIC8vIGlmIHRoZSBzaGlwIHdlIGFyZSBjdXJyZW50bHkgcGxhY2luZyBleGlzdHMsIG1lYW5pbmcgd2UgYXJlIHJlbG9jYXRpbmcgaXQsXG4gICAgICAvLyB0aGVuIHJlc2V0IGl0cyBwb3NpdGlvbiBzbyBjaGVja1Byb3hpbWl0eSBkb2Vzbid0IGNoZWNrIGZvciBpdHMgb3duIHBvc2l0aW9uXG4gICAgICAvLyBhbmQgcHVzaCBpdHMgcG9zaXRpb25zIHRvIGEgdGVtcCBhcnJheS5cbiAgICB9XG4gICAgLy8gaWYgY2hlY2tQaXhpbWl0eSByZXR1cm5zIHRydWUgdGhlbiB3ZSBrbm93IHdlIGFyZSBwbGFjaW5nIG91ciBjdXJyZW50IHNoaXAgdG9vIGNsb3NlIHRvIGFub3RoZXIgc2hpcCwgZXhpdFxuICAgIGlmICh0aGlzLmNoZWNrUHJveGltaXR5KFt4LCB5XSwgc2hpcExlbmd0aCwgZGlyZWN0aW9uKSkge1xuICAgICAgY29uc29sZS5sb2coJ29jY3VwaWVkIGJ5IHNoaXAgbmVhcmJ5IChzaWRlcyBvciB0b3AvYm90dG9tIGFuZCBlZGdlcyknKTtcbiAgICAgIC8vIGlmIHdlIHRlbXBQb3NpdGlvbnMgaGFzIGxlbmd0aCwgbWVhbmluZyB3ZSBmYWlsZWQgdG8gcmVsb2NhdGUgYW4gZXhpc3Rpbmcgc2hpcCxcbiAgICAgIC8vIHRoZW4gcHVzaCB0aGF0IGV4aXN0aW5nIHNoaXAncyBwb3NpdGlvbnMgYmFjayB0byB0aGUgZ2FtZWJvYXJkLlxuICAgICAgaWYgKHRlbXBQb3NpdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHRlbXBQb3NpdGlvbnMuZm9yRWFjaCgocG9zKSA9PiB7XG4gICAgICAgICAgdGhpcy5nYW1lYm9hcmRbcG9zWzBdXVtwb3NbMV1dID0gbmV3U2hpcC5nZXRTaGlwTmFtZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyByZXNldCBzaGlwJ3MgbGVuZ3RoIHNpbmNlIHdlIGhhdmUgaXQgc2F2ZWQgYXQgdmFyaWFibGUgc2hpcExlbmd0aFxuICAgIC8vIGFuZCBmaWxsIHRoZSBsZW5ndGggYXJyYXkgd2l0aCB0aGlzIHNoaXAncyBwb3NpdGlvblxuICAgIG5ld1NoaXAubGVuZ3RoID0gW107XG4gICAgd2hpbGUgKHNoaXBMZW5ndGggPiAwKSB7XG4gICAgICBuZXdTaGlwLmxlbmd0aC5wdXNoKFt4Q29vciwgeUNvb3JdKTtcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09ICd2ZXInKSB7XG4gICAgICAgIHRoaXMuZ2FtZWJvYXJkW3hDb29yXVt5Q29vcl0gPSBuZXdTaGlwLmdldFNoaXBOYW1lKCk7XG4gICAgICAgIHhDb29yICs9IDE7XG4gICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcicpIHtcbiAgICAgICAgdGhpcy5nYW1lYm9hcmRbeENvb3JdW3lDb29yXSA9IG5ld1NoaXAuZ2V0U2hpcE5hbWUoKTtcbiAgICAgICAgeUNvb3IgKz0gMTtcbiAgICAgIH1cbiAgICAgIHNoaXBMZW5ndGggLT0gMTtcbiAgICB9XG5cbiAgICBpZiAoIWNoZWNrU2hpcEV4aXN0cykge1xuICAgICAgdGhpcy5zaGlwcy5wdXNoKG5ld1NoaXApO1xuICAgIH0gLy8gb25seSBwdXNoIGN1cnJlbnQgc2hpcCB0byBzaGlwcyBpZiBpdCdzIGEgbmV3IHNoaXBcbiAgfVxuXG4gIGNoZWNrUHJveGltaXR5KFt4LCB5XSwgc2hpcExlbmd0aCwgZGlyZWN0aW9uKSB7XG4gICAgbGV0IHhDb29yID0geDtcbiAgICBsZXQgeUNvb3IgPSB5O1xuICAgIGxldCBsZW5ndGggPSBzaGlwTGVuZ3RoO1xuICAgIGxldCBtb3ZlcyA9IFtdO1xuICAgIGlmIChkaXJlY3Rpb24gPT09ICd2ZXInKSB7XG4gICAgICBtb3ZlcyA9IFtcbiAgICAgICAgeyB4OiB4Q29vciAtIDEsIHk6IHlDb29yIH0sXG4gICAgICAgIHsgeDogeENvb3IgLSAxLCB5OiB5Q29vciAtIDEgfSxcbiAgICAgICAgeyB4OiB4Q29vciAtIDEsIHk6IHlDb29yICsgMSB9LFxuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcicpIHtcbiAgICAgIG1vdmVzID0gW1xuICAgICAgICB7IHg6IHhDb29yLCB5OiB5Q29vciAtIDEgfSxcbiAgICAgICAgeyB4OiB4Q29vciAtIDEsIHk6IHlDb29yIC0gMSB9LFxuICAgICAgICB7IHg6IHhDb29yICsgMSwgeTogeUNvb3IgLSAxIH0sXG4gICAgICBdO1xuICAgIH0gLy8gXiBzdGFuZGFyZCBwb3NpdGlvbnMgZm9yIHRvcCBwYXJ0IG9mIHRoZSBzaGlwLlxuXG4gICAgd2hpbGUgKGxlbmd0aCA+IDApIHtcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09ICd2ZXInKSB7XG4gICAgICAgIG1vdmVzLnB1c2goeyB4OiB4Q29vciwgeTogeUNvb3IgLSAxIH0sIHsgeDogeENvb3IsIHk6IHlDb29yICsgMSB9KTsgLy8gcG9zaXRpb25zIGZvciBzaWRlcyBvZiB0aGUgc2hpcFxuICAgICAgICBtb3Zlcy5wdXNoKHsgeDogeENvb3IsIHk6IHlDb29yIH0pOyAvLyBwb3NpdGlvbnMgZm9yIHRoZSBzaGlwIGl0c2VsZlxuICAgICAgICB4Q29vciArPSAxO1xuICAgICAgICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgbW92ZXMucHVzaChcbiAgICAgICAgICAgIHsgeDogeENvb3IsIHk6IHlDb29yIH0sXG4gICAgICAgICAgICB7IHg6IHhDb29yLCB5OiB5Q29vciAtIDEgfSxcbiAgICAgICAgICAgIHsgeDogeENvb3IsIHk6IHlDb29yICsgMSB9XG4gICAgICAgICAgKTsgLy8gXiBwb3NpdGlvbnMgZm9yIHRoZSBib3R0b20gcGFydCBvZiB0aGUgc2hpcC5cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdob3InKSB7XG4gICAgICAgIG1vdmVzLnB1c2goeyB4OiB4Q29vciAtIDEsIHk6IHlDb29yIH0sIHsgeDogeENvb3IgKyAxLCB5OiB5Q29vciB9KTsgLy8gcG9zaXRpb25zIGZvciBzaWRlcyBvZiB0aGUgc2hpcFxuICAgICAgICBtb3Zlcy5wdXNoKHsgeDogeENvb3IsIHk6IHlDb29yIH0pOyAvLyBwb3NpdGlvbnMgZm9yIHRoZSBzaGlwIGl0c2VsZlxuICAgICAgICB5Q29vciArPSAxO1xuICAgICAgICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgbW92ZXMucHVzaChcbiAgICAgICAgICAgIHsgeDogeENvb3IsIHk6IHlDb29yIH0sXG4gICAgICAgICAgICB7IHg6IHhDb29yIC0gMSwgeTogeUNvb3IgfSxcbiAgICAgICAgICAgIHsgeDogeENvb3IgKyAxLCB5OiB5Q29vciB9XG4gICAgICAgICAgKTsgLy8gXiBwb3NpdGlvbnMgZm9yIHRoZSBib3R0b20gcGFydCBvZiB0aGUgc2hpcC5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZW5ndGggLT0gMTtcbiAgICB9XG5cbiAgICBjb25zdCBzZWFyY2hBcm91bmQgPSBtb3Zlcy5zb21lKChtKSA9PiB7XG4gICAgICBsZXQgeyBjaGVja1ggfSA9IG07XG4gICAgICBjaGVja1ggPSBtLng7XG4gICAgICBsZXQgeyBjaGVja1kgfSA9IG07XG4gICAgICBjaGVja1kgPSBtLnk7XG5cbiAgICAgIC8vIGlmIHdlIGFyZSBzZWFyY2hpbmcgZm9yIG91dCBvZiBnYW1lYm9hcmQgYm9yZGVyIGp1c3Qgc2tpcFxuICAgICAgaWYgKGNoZWNrWCA8IDAgfHwgY2hlY2tYID4gOSB8fCBjaGVja1kgPCAwIHx8IGNoZWNrWSA+IDkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5nYW1lYm9hcmRbY2hlY2tYXVtjaGVja1ldICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIGAke3RoaXMuZ2FtZWJvYXJkW2NoZWNrWF1bY2hlY2tZXX0gJHtjaGVja1h9IC8gJHtjaGVja1l9IEZJTExFRGBcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHRydWU7IC8vIHJldHVybiB0cnVlIGlmIHRoZXJlIGlzIGEgc2hpcCBuZWFyYnlcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChzZWFyY2hBcm91bmQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJlY2VpdmVBdHRhY2soW3gsIHldKSB7XG4gICAgY29uc3QgeENvb3IgPSB4O1xuICAgIGNvbnN0IHlDb29yID0geTtcbiAgICBpZiAoeENvb3IgPiA5IHx8IHhDb29yIDwgMCB8fCB5Q29vciA+IDkgfHwgeUNvb3IgPCAwKSB7XG4gICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBjb29yZGluYXRlcycpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBoaXRDb29yID0gdGhpcy5nYW1lYm9hcmRbeENvb3JdW3lDb29yXTtcblxuICAgIGlmIChoaXRDb29yICE9PSBudWxsKSB7XG4gICAgICBsZXQgc2hpcEhpdDtcbiAgICAgIGlmIChoaXRDb29yID09PSAnQ2FyJykge1xuICAgICAgICBzaGlwSGl0ID0gJ0NhcnJpZXInO1xuICAgICAgfSBlbHNlIGlmIChoaXRDb29yID09PSAnQmF0Jykge1xuICAgICAgICBzaGlwSGl0ID0gJ0JhdHRsZXNoaXAnO1xuICAgICAgfSBlbHNlIGlmIChoaXRDb29yID09PSAnRGVzJykge1xuICAgICAgICBzaGlwSGl0ID0gJ0Rlc3Ryb3llcic7XG4gICAgICB9IGVsc2UgaWYgKGhpdENvb3IgPT09ICdTdWInKSB7XG4gICAgICAgIHNoaXBIaXQgPSAnU3VibWFyaW5lJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNoaXBIaXQgPSAnUGF0cm9sQm9hdCc7XG4gICAgICB9XG5cbiAgICAgIHNoaXBIaXQgPSB0aGlzLmdldFNoaXAoc2hpcEhpdCk7XG4gICAgICBsZXQgY291bnRlciA9IDE7XG4gICAgICBzaGlwSGl0Lmxlbmd0aC5zb21lKChwb3MpID0+IHtcbiAgICAgICAgaWYgKHBvc1swXSA9PT0geENvb3IgJiYgcG9zWzFdID09PSB5Q29vcikge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7IC8vIF4gZmluZCB3aGljaCBwb3NpdGlvbiB3ZSBhcmUgaGl0dGluZyB0aGUgc2hpcCBmcm9tXG4gICAgICBzaGlwSGl0LmhpdChjb3VudGVyKTtcbiAgICAgIHRoaXMuZ2FtZWJvYXJkW3hDb29yXVt5Q29vcl0gPSAnaGl0JzsgLy8gdXBkYXRlIGdhbWVib2FyZCB0byBkaXNwbGF5ICdoaXQnXG5cbiAgICAgIGNvbnNvbGUubG9nKGBoaXR0aW5nICR7c2hpcEhpdC5zaGlwQ2xhc3N9IGZyb20gcG9zaXRpb24gJHtjb3VudGVyfWApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHRoaXMubWlzc2VkU2hvdHMucHVzaChbeENvb3IsIHlDb29yXSk7IC8vIGtpbmQgb2YgZm9yZ290IGFib3V0IHRoaXMsIHRoaXMgaXMgbm90IGJlaWduIHVzZWRcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLm1pc3NlZFNob3RzKTtcbiAgICBjb25zb2xlLmxvZygnaGl0IG1pc3NlZCcpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNoZWNrQWxsU2hpcHNTdW5rKCkge1xuICAgIGNvbnN0IHNoaXBzID0gdGhpcy5zaGlwcztcblxuICAgIGNvbnN0IEFsbFNoaXBzQ2hlY2sgPSBzaGlwcy5ldmVyeSgoc2hpcCkgPT4ge1xuICAgICAgaWYgKHNoaXAuaXNTdW5rID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIGlmIChBbGxTaGlwc0NoZWNrID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0U2hpcChzaGlwKSB7XG4gICAgY29uc3QgYWxsU2hpcHMgPSB0aGlzLnNoaXBzO1xuXG4gICAgY29uc3QgZmluZFNoaXAgPSAoZWxlbWVudCkgPT4gZWxlbWVudC5zaGlwQ2xhc3MgPT09IHNoaXA7XG4gICAgY29uc3QgY2hlY2tTaGlwRXhpc3RzID0gYWxsU2hpcHMuZmluZChmaW5kU2hpcCk7XG4gICAgaWYgKGNoZWNrU2hpcEV4aXN0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnbm8gc3VjaCBzaGlwJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBjaGVja1NoaXBFeGlzdHM7XG4gIH1cblxuICByZW1vdmVTaGlwKHNoaXApIHtcbiAgICBjb25zdCBzaGlwVG9CZVJlbW92ZWQgPSB0aGlzLmdldFNoaXAoc2hpcCk7XG4gICAgY29uc3QgcG9zaXRpb25zT2ZUaGVTaGlwID0gc2hpcFRvQmVSZW1vdmVkLmxlbmd0aDtcblxuICAgIHBvc2l0aW9uc09mVGhlU2hpcC5mb3JFYWNoKChwb3MpID0+IHtcbiAgICAgIHRoaXMuZ2FtZWJvYXJkW3Bvc1swXV1bcG9zWzFdXSA9IG51bGw7XG4gICAgfSk7XG4gICAgdGhpcy5zaGlwcy5zcGxpY2UodGhpcy5zaGlwcy5pbmRleE9mKHNoaXBUb0JlUmVtb3ZlZCksIDEpOyAvLyByZW1vdmUgdGhlIHNoaXBcbiAgfVxufVxuXG4vLyBjb25zdCBnYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4vLyBnYW1lYm9hcmQucGxhY2VTaGlwKCdDYXJyaWVyJywgWzAsIDBdLCAnaG9yJyk7XG4vLyBnYW1lYm9hcmQucGxhY2VTaGlwKCdCYXR0bGVzaGlwJywgWzYsIDJdLCAndmVyJyk7XG4vLyBnYW1lYm9hcmQucGxhY2VTaGlwKCdEZXN0cm95ZXInLCBbMiwgMV0sICd2ZXInKTtcbi8vIGdhbWVib2FyZC5wbGFjZVNoaXAoJ1N1Ym1hcmluZScsIFs1LCA2XSwgJ3ZlcicpO1xuLy8gZ2FtZWJvYXJkLnBsYWNlU2hpcCgnUGF0cm9sQm9hdCcsIFs4LCA5XSwgJ3ZlcicpO1xuXG4vLyBnYW1lYm9hcmQucGxhY2VTaGlwKCdTdWJtYXJpbmUnLCBbNCwgOF0sICd2ZXInKTtcblxuLy8gLy8gLy8gZ2FtZWJvYXJkLnJlbW92ZVNoaXAoJ1N1Ym1hcmluZScpO1xuXG4vLyAvLyAvLyBnYW1lYm9hcmQucmVjZWl2ZUF0dGFjayhbMywgMl0pO1xuXG4vLyBnYW1lYm9hcmQuZ2FtZWJvYXJkLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbi8vICAgY29uc29sZS5sb2coZWxlbWVudCk7XG4vLyB9KTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tICcuL2dhbWVib2FyZC5qcyc7XG5cbmNsYXNzIFBsYXllciB7XG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICB0aGlzLnBsYXllckJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIHRoaXMub3Bwb25lbnQgPSBudWxsO1xuICAgIHRoaXMuYWxsU2hvdHMgPSBbXTtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMud2lubmVyID0gZmFsc2U7XG4gIH1cblxuICAvLyBnZXRUdXJuKCkge1xuICAvLyAgIHJldHVybiB0aGlzLm9wcG9uZW50O1xuICAvLyB9XG5cbiAgZ2V0TmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgYXR0YWNrcyhbeCwgeV0pIHtcbiAgICBpZiAodGhpcy5jaGVja0FscmVhZHlTaG90KFt4LCB5XSkpIHtcbiAgICAgIHJldHVybjtcbiAgICAgIC8vIGlmIHRoZSBbeCwgeV0gcG9zaXRpb24gaXMgYWxyZWFkeSBzaG90IGF0IHJldHVybiAvLyBleGl0XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWxsU2hvdHMucHVzaChbeCwgeV0pO1xuICAgICAgY29uc3QgYXR0YWNrT3Bwb25lbnQgPSB0aGlzLm9wcG9uZW50LnBsYXllckJvYXJkLnJlY2VpdmVBdHRhY2soW3gsIHldKTsgLy8gcmV0dXJucyB0cnVlIGlmIHNob3QgaGl0LCBmYWxzZSBpZiBpdCBkaWRuJ3RcbiAgICAgIGNvbnN0IGlzQWxsT3Bwb25lbnRTaGlwc1N1bmsgPVxuICAgICAgICB0aGlzLm9wcG9uZW50LnBsYXllckJvYXJkLmNoZWNrQWxsU2hpcHNTdW5rKCk7IC8vIHJldHVybnMgdHJ1ZSBpZiBhbGwgc2hpcHMgYXJlIHN1bmssIGZhbHNlIG90aGVyd2lzZVxuXG4gICAgICBpZiAoaXNBbGxPcHBvbmVudFNoaXBzU3VuaykgdGhpcy53aW5uZXIgPSB0cnVlO1xuICAgICAgcmV0dXJuIGF0dGFja09wcG9uZW50O1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrQWxyZWFkeVNob3QoW3gsIHldKSB7XG4gICAgY29uc3QgY2hlY2tBbHJlYWR5U2hvdCA9IHRoaXMuYWxsU2hvdHMuc29tZSgoc2hvdCkgPT4ge1xuICAgICAgaWYgKHNob3RbMF0gPT09IHggJiYgc2hvdFsxXSA9PT0geSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuICAgIGlmIChjaGVja0FscmVhZHlTaG90ID09PSB0cnVlKSB7XG4gICAgICBjb25zb2xlLmxvZygncG9zaXRpb24gaXMgYWxyZWFkeSBzaG90IGF0Jyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmFuZG9tTnVtKCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gIH1cblxuICByYW5kb21EaXIoKSB7XG4gICAgY29uc3QgbXlBcnJheSA9IFsndmVyJywgJ2hvciddO1xuICAgIHJldHVybiBteUFycmF5W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG15QXJyYXkubGVuZ3RoKV07XG4gIH1cblxuICBBSVBsYWNlU2hpcHMoKSB7XG4gICAgY29uc3QgcGxhY2VDYXJyaWVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICdDYXJyaWVyJyxcbiAgICAgICAgW3RoaXMucmFuZG9tTnVtKCksIHRoaXMucmFuZG9tTnVtKCldLFxuICAgICAgICB0aGlzLnJhbmRvbURpcigpXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBwbGFjZUJhdHRsZXNoaXAgPSAoKSA9PiB7XG4gICAgICB0aGlzLnBsYXllckJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgJ0JhdHRsZXNoaXAnLFxuICAgICAgICBbdGhpcy5yYW5kb21OdW0oKSwgdGhpcy5yYW5kb21OdW0oKV0sXG4gICAgICAgIHRoaXMucmFuZG9tRGlyKClcbiAgICAgICk7XG4gICAgfTtcblxuICAgIGNvbnN0IHBsYWNlRGVzdHJveWVyID0gKCkgPT4ge1xuICAgICAgdGhpcy5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICdEZXN0cm95ZXInLFxuICAgICAgICBbdGhpcy5yYW5kb21OdW0oKSwgdGhpcy5yYW5kb21OdW0oKV0sXG4gICAgICAgIHRoaXMucmFuZG9tRGlyKClcbiAgICAgICk7XG4gICAgfTtcblxuICAgIGNvbnN0IHBsYWNlU3VibWFyaW5lID0gKCkgPT4ge1xuICAgICAgdGhpcy5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICdTdWJtYXJpbmUnLFxuICAgICAgICBbdGhpcy5yYW5kb21OdW0oKSwgdGhpcy5yYW5kb21OdW0oKV0sXG4gICAgICAgIHRoaXMucmFuZG9tRGlyKClcbiAgICAgICk7XG4gICAgfTtcblxuICAgIGNvbnN0IHBsYWNlUGF0cm9sQm9hdCA9ICgpID0+IHtcbiAgICAgIHRoaXMucGxheWVyQm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAnUGF0cm9sQm9hdCcsXG4gICAgICAgIFt0aGlzLnJhbmRvbU51bSgpLCB0aGlzLnJhbmRvbU51bSgpXSxcbiAgICAgICAgdGhpcy5yYW5kb21EaXIoKVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3QgYWxsU2hpcHMgPSB0aGlzLnBsYXllckJvYXJkLnNoaXBzO1xuICAgIGNvbnN0IHNoaXBzVG9BZGQgPSBbXG4gICAgICAnQ2FycmllcicsXG4gICAgICAnQmF0dGxlc2hpcCcsXG4gICAgICAnRGVzdHJveWVyJyxcbiAgICAgICdTdWJtYXJpbmUnLFxuICAgICAgJ1BhdHJvbEJvYXQnLFxuICAgIF07XG5cbiAgICB3aGlsZSAoYWxsU2hpcHMubGVuZ3RoICE9PSA1KSB7XG4gICAgICBhbGxTaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgIGNvbnN0IHNoaXBOYW1lID0gc2hpcC5nZXRTaGlwQ2xhc3MoKTtcbiAgICAgICAgaWYgKHNoaXBzVG9BZGQuaW5jbHVkZXMoc2hpcE5hbWUpKSB7XG4gICAgICAgICAgc2hpcHNUb0FkZC5zcGxpY2Uoc2hpcHNUb0FkZC5pbmRleE9mKHNoaXBOYW1lKSwgMSk7IC8vIHJlbW92ZSB0aGUgc2hpcFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHNoaXBzVG9BZGQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICBpZiAoc2hpcCA9PT0gJ0NhcnJpZXInKSB7XG4gICAgICAgICAgcGxhY2VDYXJyaWVyKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2hpcCA9PT0gJ0JhdHRsZXNoaXAnKSB7XG4gICAgICAgICAgcGxhY2VCYXR0bGVzaGlwKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2hpcCA9PT0gJ0Rlc3Ryb3llcicpIHtcbiAgICAgICAgICBwbGFjZURlc3Ryb3llcigpO1xuICAgICAgICB9IGVsc2UgaWYgKHNoaXAgPT09ICdTdWJtYXJpbmUnKSB7XG4gICAgICAgICAgcGxhY2VTdWJtYXJpbmUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChzaGlwID09PSAnUGF0cm9sQm9hdCcpIHtcbiAgICAgICAgICBwbGFjZVBhdHJvbEJvYXQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgQUlBdHRhY2tzKCkge1xuICAgIGNvbnN0IGF0dGFja0Nvb3IgPSBbdGhpcy5yYW5kb21OdW0oKSwgdGhpcy5yYW5kb21OdW0oKV07XG4gICAgaWYgKHRoaXMuY2hlY2tBbHJlYWR5U2hvdChbYXR0YWNrQ29vclswXSwgYXR0YWNrQ29vclsxXV0pKSB7XG4gICAgICBjb25zb2xlLmxvZygnQUkgaXMgZ29ubmEgcmV0cnkgaGl0dGluZycpO1xuICAgICAgcmV0dXJuIHRoaXMuQUlBdHRhY2tzKCk7IC8vIGRvIEFJQXR0YWNrcyB1bnRpbCBBSSBoaXRzIHdpdGggYXZhaWxhYmxlIHBvc2l0aW9uXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXR0YWNrcyhhdHRhY2tDb29yKTtcbiAgICAgIHJldHVybiBhdHRhY2tDb29yO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJjbGFzcyBTaGlwIHtcbiAgY29uc3RydWN0b3Ioc2hpcENsYXNzKSB7XG4gICAgdGhpcy5zaGlwQ2xhc3MgPSBzaGlwQ2xhc3M7XG4gICAgdGhpcy5sZW5ndGggPSB0aGlzLmFzc2lnbkNsYXNzTGVuZ3RoKCk7XG4gICAgdGhpcy5pc1N1bmsgPSBmYWxzZTtcbiAgfVxuXG4gIGFzc2lnbkNsYXNzTGVuZ3RoKCkge1xuICAgIGlmICh0aGlzLnNoaXBDbGFzcyA9PT0gJ0NhcnJpZXInKSB7XG4gICAgICByZXR1cm4gWzEsIDIsIDMsIDQsIDVdO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaGlwQ2xhc3MgPT09ICdCYXR0bGVzaGlwJykge1xuICAgICAgcmV0dXJuIFsxLCAyLCAzLCA0XTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hpcENsYXNzID09PSAnRGVzdHJveWVyJykge1xuICAgICAgcmV0dXJuIFsxLCAyLCAzXTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hpcENsYXNzID09PSAnU3VibWFyaW5lJykge1xuICAgICAgcmV0dXJuIFsxLCAyLCAzXTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc2hpcENsYXNzID09PSAnUGF0cm9sQm9hdCcpIHtcbiAgICAgIHJldHVybiBbMSwgMl07XG4gICAgfVxuICAgIHJldHVybiBjb25zb2xlLmxvZygnc29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcbiAgfVxuXG4gIGdldExlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGgubGVuZ3RoO1xuICB9XG5cbiAgZ2V0U2hpcE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpcENsYXNzLnNsaWNlKDAsIDMpO1xuICB9XG5cbiAgZ2V0U2hpcENsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLnNoaXBDbGFzcztcbiAgfVxuXG4gIGhpdChudW0pIHtcbiAgICBpZiAodGhpcy5sZW5ndGgubGVuZ3RoID49IG51bSAmJiBudW0gPiAwKSB7XG4gICAgICB0aGlzLmxlbmd0aFtudW0gLSAxXSA9ICdoaXQnO1xuICAgICAgdGhpcy5zdW5rKCk7XG4gICAgfVxuICB9XG5cbiAgc3VuaygpIHtcbiAgICBjb25zdCBjaGVja1N1bmsgPSAoY3VycmVudCkgPT4gY3VycmVudCA9PT0gJ2hpdCc7XG5cbiAgICBpZiAodGhpcy5sZW5ndGguZXZlcnkoY2hlY2tTdW5rKSkgdGhpcy5pc1N1bmsgPSB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9jc3Mvc3R5bGUuY3NzJztcbmltcG9ydCAnLi9pbmRleC5odG1sJztcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9jb21wb25lbnRzL3BsYXllci5qcyc7XG5pbXBvcnQgeyBjcmVhdGVQbGF5ZXJHcmlkLCBwbGFjZVNoaXBzIH0gZnJvbSAnLi9jb21wb25lbnRzL2RvbS1tYW5pcHVsYXRpb24uanMnO1xuXG5jb25zdCBOZXdQbGF5ZXIgPSBQbGF5ZXI7XG5cbmNvbnN0IHBsYXllck9uZSA9IG5ldyBOZXdQbGF5ZXIoJ0h1bWFuJyk7XG5jb25zdCBwbGF5ZXJBSSA9IG5ldyBOZXdQbGF5ZXIoJ0NvbXB1dGVyJyk7XG5wbGF5ZXJPbmUub3Bwb25lbnQgPSBwbGF5ZXJBSTtcbnBsYXllckFJLm9wcG9uZW50ID0gcGxheWVyT25lO1xuXG5jb25zdCBnYW1lU3RhcnQgPSB7XG4gIGluaXQoKSB7XG4gICAgY3JlYXRlUGxheWVyR3JpZChwbGF5ZXJPbmUpO1xuICAgIGNyZWF0ZVBsYXllckdyaWQocGxheWVyQUkpO1xuXG4gICAgcGxheWVyQUkuQUlQbGFjZVNoaXBzKCk7XG4gICAgLy8gdGhpcy5BSVVwZGF0ZURpc3BsYXkocGxheWVyQUkpOyAvLyBpZiB5b3Ugd2FudCB0byB2aXN1YWxpemUgQUkncyBzaGlwc1xuICB9LFxuXG4gIHBsYXllclBsYWNlU2hpcChwbGF5ZXIsIHNoaXBDbGFzcywgW3gsIHldLCBkaXIpIHtcbiAgICBjb25zdCBwbGF5ZXJHYW1lYm9hcmQgPSBwbGF5ZXIucGxheWVyQm9hcmQ7XG4gICAgY29uc3Qgc2hpcFBsYWNlZCA9IHNoaXBDbGFzcztcbiAgICBjb25zdCBwb3MwID0geDtcbiAgICBjb25zdCBwb3MxID0geTtcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBkaXI7XG5cbiAgICBpZiAoXG4gICAgICBwbGF5ZXJHYW1lYm9hcmQucGxhY2VTaGlwKHNoaXBQbGFjZWQsIFtwb3MwLCBwb3MxXSwgZGlyZWN0aW9uKSA9PT0gZmFsc2VcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9IC8vIHBsYWNlIHRoZSBzaGlwIGluIHBsYXllcnMgZ2FtZWJvYXJkIC8vIGlmIGZhbHNlIGlzIHJldHVybmVkIHRoZW4gZXhpdCwgc29tZXRoaW5nIHdlbnQgd3JvbmdcblxuICAgIGNvbnN0IHNoaXAgPSBwbGF5ZXJHYW1lYm9hcmQuZ2V0U2hpcChzaGlwUGxhY2VkKTsgLy8gc3RvcmUgdGhlIHNoaXBcbiAgICBwbGFjZVNoaXBzKHBsYXllck9uZSwgc2hpcCk7XG4gIH0sXG5cbiAgQUlVcGRhdGVEaXNwbGF5KHBsYXllckFJKSB7XG4gICAgY29uc3QgQUlTaGlwcyA9IHBsYXllckFJLnBsYXllckJvYXJkLnNoaXBzO1xuXG4gICAgQUlTaGlwcy5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICBwbGFjZVNoaXBzKHBsYXllckFJLCBzaGlwKTtcbiAgICB9KTtcbiAgfSxcbn07XG5cbi8vIGNvbnN0IGdhbWVMb29wID0gKCkgPT4ge307XG5cbmdhbWVTdGFydC5pbml0KCk7XG5cbmdhbWVTdGFydC5wbGF5ZXJQbGFjZVNoaXAocGxheWVyT25lLCAnQ2FycmllcicsIFswLCAwXSwgJ2hvcicpO1xuZ2FtZVN0YXJ0LnBsYXllclBsYWNlU2hpcChwbGF5ZXJPbmUsICdCYXR0bGVzaGlwJywgWzEsIDddLCAndmVyJyk7XG5nYW1lU3RhcnQucGxheWVyUGxhY2VTaGlwKHBsYXllck9uZSwgJ0Rlc3Ryb3llcicsIFs1LCA0XSwgJ3ZlcicpO1xuZ2FtZVN0YXJ0LnBsYXllclBsYWNlU2hpcChwbGF5ZXJPbmUsICdTdWJtYXJpbmUnLCBbMywgMV0sICd2ZXInKTtcbmdhbWVTdGFydC5wbGF5ZXJQbGFjZVNoaXAocGxheWVyT25lLCAnUGF0cm9sQm9hdCcsIFs0LCA5XSwgJ3ZlcicpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9