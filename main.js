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
var code = "<!DOCTYPE html>\n<html>\n\n<head>\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <title>Battleship</title>\n    <meta name=\"description\" content=\"\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n</head>\n\n<body>\n    <main class=\"main-container\">\n        <h1>Battleship</h1>\n\n        <div class=\"players-container\">\n            <div class=\"player-one-container\">\n\n            </div>\n            <div class=\"player-two-container\">\n\n            </div>\n        </div>\n\n        <!-- <div class=\"help-inst\">\n            <p>Carrier</p>\n            <p>Battleship</p>\n            <p>Destroyer</p>\n            <p>Submarine</p>\n            <p>Patrol Boat</p>\n        </div> -->\n    </main>\n</body>\n\n</html>";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7O0FDTnlCO0FBQ0g7QUFDc0I7QUFDb0M7O0FBRWhGLGtCQUFrQiw2REFBTTs7QUFFeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUksaUZBQWdCO0FBQ3BCLElBQUksaUZBQWdCOztBQUVwQjtBQUNBLHVDQUF1QztBQUN2QyxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU4sc0RBQXNEO0FBQ3RELElBQUksMkVBQVU7QUFDZCxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQSxNQUFNLDJFQUFVO0FBQ2hCLEtBQUs7QUFDTCxHQUFHO0FBQ0g7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguaHRtbCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2Nzcy9zdHlsZS5jc3M/MGE0OCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXBvbmVudHMvZG9tLW1hbmlwdWxhdGlvbi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbXBvbmVudHMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvY29tcG9uZW50cy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jb21wb25lbnRzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE1vZHVsZVxudmFyIGNvZGUgPSBcIjwhRE9DVFlQRSBodG1sPlxcbjxodG1sPlxcblxcbjxoZWFkPlxcbiAgICA8bWV0YSBjaGFyc2V0PVxcXCJ1dGYtOFxcXCI+XFxuICAgIDxtZXRhIGh0dHAtZXF1aXY9XFxcIlgtVUEtQ29tcGF0aWJsZVxcXCIgY29udGVudD1cXFwiSUU9ZWRnZVxcXCI+XFxuICAgIDx0aXRsZT5CYXR0bGVzaGlwPC90aXRsZT5cXG4gICAgPG1ldGEgbmFtZT1cXFwiZGVzY3JpcHRpb25cXFwiIGNvbnRlbnQ9XFxcIlxcXCI+XFxuICAgIDxtZXRhIG5hbWU9XFxcInZpZXdwb3J0XFxcIiBjb250ZW50PVxcXCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MVxcXCI+XFxuPC9oZWFkPlxcblxcbjxib2R5PlxcbiAgICA8bWFpbiBjbGFzcz1cXFwibWFpbi1jb250YWluZXJcXFwiPlxcbiAgICAgICAgPGgxPkJhdHRsZXNoaXA8L2gxPlxcblxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicGxheWVycy1jb250YWluZXJcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInBsYXllci1vbmUtY29udGFpbmVyXFxcIj5cXG5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJwbGF5ZXItdHdvLWNvbnRhaW5lclxcXCI+XFxuXFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgIDwhLS0gPGRpdiBjbGFzcz1cXFwiaGVscC1pbnN0XFxcIj5cXG4gICAgICAgICAgICA8cD5DYXJyaWVyPC9wPlxcbiAgICAgICAgICAgIDxwPkJhdHRsZXNoaXA8L3A+XFxuICAgICAgICAgICAgPHA+RGVzdHJveWVyPC9wPlxcbiAgICAgICAgICAgIDxwPlN1Ym1hcmluZTwvcD5cXG4gICAgICAgICAgICA8cD5QYXRyb2wgQm9hdDwvcD5cXG4gICAgICAgIDwvZGl2PiAtLT5cXG4gICAgPC9tYWluPlxcbjwvYm9keT5cXG5cXG48L2h0bWw+XCI7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBjb2RlOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImNvbnN0IHBsYXllck9uZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItb25lLWNvbnRhaW5lcicpO1xuY29uc3QgcGxheWVyVHdvQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci10d28tY29udGFpbmVyJyk7XG5jb25zdCBjb250ZW50UGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4tY29udGFpbmVyJyk7XG5cbmNvbnN0IGdldFBsYXllckNvbnRhaW5lciA9ICh0aGlzUGxheWVyKSA9PiB7XG4gIGxldCBjdXJyZW50UGxheWVyQ29udGFpbmVyO1xuICBpZiAodGhpc1BsYXllci5nZXROYW1lKCkgIT09ICdDb21wdXRlcicpIHtcbiAgICBjdXJyZW50UGxheWVyQ29udGFpbmVyID0gcGxheWVyT25lQ29udGFpbmVyO1xuICB9IGVsc2UgaWYgKHRoaXNQbGF5ZXIuZ2V0TmFtZSgpID09PSAnQ29tcHV0ZXInKSB7XG4gICAgY3VycmVudFBsYXllckNvbnRhaW5lciA9IHBsYXllclR3b0NvbnRhaW5lcjtcbiAgfVxuICByZXR1cm4gY3VycmVudFBsYXllckNvbnRhaW5lcjtcbn07XG5cbmNvbnN0IGRlY2xhcmVXaW5uZXIgPSAocGxheWVyKSA9PiB7XG4gIGxldCB3aW5uZXJDb25ncmF0c1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgd2lubmVyQ29uZ3JhdHNUZXh0LnNldEF0dHJpYnV0ZSgnaWQnLCAnd2lubmVyQ29uZ3JhdHMnKTtcbiAgd2lubmVyQ29uZ3JhdHNUZXh0LnRleHRDb250ZW50ID0gYENvbmdyYXRzICR7cGxheWVyLmdldE5hbWUoKX0gd29uIHRoZSBnYW1lIWA7XG4gIGNvbnRlbnRQYXJlbnQuYXBwZW5kQ2hpbGQod2lubmVyQ29uZ3JhdHNUZXh0KTtcbn07XG5cbmNvbnN0IEFJQXR0YWNrc0RPTSA9ICh0aGlzUGxheWVyKSA9PiB7XG4gIGNvbnNvbGUubG9nKHRoaXNQbGF5ZXIpO1xuICBjb25zdCBBSUF0dGFja0Nvb3JkcyA9IHRoaXNQbGF5ZXIuQUlBdHRhY2tzKCk7XG4gIGNvbnN0IGRhdGFJRCA9IGAke0FJQXR0YWNrQ29vcmRzWzBdfSAke0FJQXR0YWNrQ29vcmRzWzFdfWA7XG4gIGNvbnN0IGNlbGwgPSBwbGF5ZXJPbmVDb250YWluZXIucXVlcnlTZWxlY3RvcihgW2RhdGEtY29vcj0nJHtkYXRhSUR9J11gKTtcbiAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdjZWxsJyk7XG4gIC8vIG9ubHkgdGhlIGh1bWFuJ3Mgc2hpcHMgaGF2ZSBpZCB0byB2aXN1YWxpemUgdGhlbSBpbiB0aGUgYm9hcmQgd2l0aCBkaWZmZXJlbnQgY29sb3JzXG4gIGlmIChjZWxsLmhhc0F0dHJpYnV0ZSgnaWQnKSkge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnaGl0Jyk7XG4gIH0gZWxzZSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzZWQnKTtcbiAgfVxufTtcblxuY29uc3QgcmVjaWV2ZUF0dGFjayA9IChkaXNwbGF5Q2VsbCwgYXJyYXlGb3JtYXQsIHRoaXNQbGF5ZXIpID0+IHtcbiAgZGlzcGxheUNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnY2VsbCcpO1xuICBjb25zdCBwbGF5ZXJPbmVBdHRhY2tzID0gdGhpc1BsYXllci5vcHBvbmVudC5hdHRhY2tzKGFycmF5Rm9ybWF0KTtcbiAgLy8gd2hlbiB3ZSBjbGljayBvbiBwbGF5ZXJUd28ncyBib2FyZCBwbGF5ZXJUd28ncyBvcHBvbmVudCBhdHRhY2tzLlxuICBpZiAocGxheWVyT25lQXR0YWNrcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IC8vIHVuZGVmaW5lZCBpcyByZXR1cm5lZCB3aGVuIHRoZSBwb3NpdGlvbiBpcyBhbHJlYWR5IHNob3RcblxuICBpZiAocGxheWVyT25lQXR0YWNrcykge1xuICAgIGRpc3BsYXlDZWxsLmNsYXNzTGlzdC5hZGQoJ2hpdCcpO1xuICB9IGVsc2Uge1xuICAgIGRpc3BsYXlDZWxsLmNsYXNzTGlzdC5hZGQoJ21pc3NlZCcpO1xuICB9XG4gIHJldHVybiB0cnVlO1xuXG4gIC8vIG5vdyBpdCdzIEFJJ3MgdHVybiB0byBhdHRhY2tcbn07XG5cbmNvbnN0IGNyZWF0ZVBsYXllckdyaWQgPSAocGxheWVyKSA9PiB7XG4gIGNvbnN0IHRoaXNQbGF5ZXIgPSBwbGF5ZXI7XG4gIGNvbnN0IGFycmF5R3JpZCA9IHRoaXNQbGF5ZXIucGxheWVyQm9hcmQuZ2FtZWJvYXJkO1xuICBjb25zdCBwbGF5ZXJDb250YWluZXIgPSBnZXRQbGF5ZXJDb250YWluZXIodGhpc1BsYXllcik7XG5cbiAgaWYgKHBsYXllckNvbnRhaW5lciA9PT0gcGxheWVyVHdvQ29udGFpbmVyKSB7XG4gICAgYXJyYXlHcmlkLmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBjZWxsSW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgZGlzcGxheUNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGlzcGxheUNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbCcpO1xuICAgICAgICBkaXNwbGF5Q2VsbC5kYXRhc2V0LmNvb3IgPSBgJHtyb3dJbmRleH0gJHtjZWxsSW5kZXh9YDtcbiAgICAgICAgY29uc3QgYXJyYXlGb3JtYXQgPSBbcm93SW5kZXgsIGNlbGxJbmRleF07XG4gICAgICAgIGRpc3BsYXlDZWxsLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgJ2NsaWNrJyxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVjaWV2ZUF0dGFjayhkaXNwbGF5Q2VsbCwgYXJyYXlGb3JtYXQsIHRoaXNQbGF5ZXIpICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICBBSUF0dGFja3NET00odGhpc1BsYXllcik7XG4gICAgICAgICAgICAgIC8vIF4gZmFsc2Ugd2lsbCBvbmx5IGJlIHJldHVybmVkIGlmIHBsYXllck9uZSBhdHRhY2sgaXMgdW5kZWZpbmVkIHdoaWNoIG1lYW5zIHBvcyBpcyBhbHJlYWR5IHNob3QsXG4gICAgICAgICAgICAgIC8vIGluIHdoaWNoIGNhc2UgQUkgZG9lc24ndCBhdHRhY2sgYW5kIHdlIHdhaXQgZm9yIHBsYXllciB0byBjbGljayBvbiBhIHRpbGUgdGhhdCBoYXNuJ3QgYmVlbiBzaG90XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpc1BsYXllci53aW5uZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgZGVjbGFyZVdpbm5lcih0aGlzUGxheWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzUGxheWVyLm9wcG9uZW50Lndpbm5lciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICBkZWNsYXJlV2lubmVyKHRoaXNQbGF5ZXIub3Bwb25lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcbiAgICAgICAgcGxheWVyQ29udGFpbmVyLmFwcGVuZENoaWxkKGRpc3BsYXlDZWxsKTtcbiAgICAgIH0pO1xuICAgIH0pOyAvLyBhZGRpbmcgZXZlbnRsaXN0ZW5lciBmb3IgcGxheWVyVHdvQ29udGFpbmVyIHNpbmNlIHRoaXMgaXMgdGhlIGNvbnRhaW5lciB0aGF0IHRoZSBodW1hbiBwbGF5ZXIgd2lsbCBiZSBhdHRhY2tpbmdcbiAgfSBlbHNlIHtcbiAgICBhcnJheUdyaWQuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgICAgcm93LmZvckVhY2goKGNlbGwsIGNlbGxJbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBkaXNwbGF5Q2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXNwbGF5Q2VsbC5jbGFzc0xpc3QuYWRkKCdjZWxsJyk7XG4gICAgICAgIGRpc3BsYXlDZWxsLmRhdGFzZXQuY29vciA9IGAke3Jvd0luZGV4fSAke2NlbGxJbmRleH1gO1xuICAgICAgICBwbGF5ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoZGlzcGxheUNlbGwpO1xuICAgICAgfSk7XG4gICAgfSk7IC8vIHRoaXMgaXMgdGhlIHBsYXllck9uZUNvbnRhaW5lclxuICB9XG5cbiAgcGxheWVyQ29udGFpbmVyLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7YXJyYXlHcmlkLmxlbmd0aH0sIGF1dG8pYDtcbiAgcGxheWVyQ29udGFpbmVyLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KCR7YXJyYXlHcmlkLmxlbmd0aH0sIGF1dG8pYDtcbn07XG5cbmNvbnN0IGFkZEhvdmVyRWZmZWN0ID0gKGxlbmd0aCwgcGxhY2VDZWxsLCBkaXJlY3Rpb24pID0+IHtcbiAgY29uc3Qgc2hpcExlbmd0aCA9IGxlbmd0aDtcblxuICBjb25zdCBkYXRhSUQgPSBwbGFjZUNlbGwuZGF0YXNldC5jb29yO1xuICBpZiAoZGF0YUlEID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgeFBvcyA9IE51bWJlcihkYXRhSURbMF0pO1xuICBsZXQgeVBvcyA9IE51bWJlcihkYXRhSURbMl0pOyAvLyBkYXRhSURbMV0gaXMgZW1wdHkgc3BhY2VcblxuICBsZXQgc2VsZWN0ZWRDZWxsID0gcGxheWVyT25lQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgYFtkYXRhLWNvb3I9JyR7eFBvc30gJHt5UG9zfSddYFxuICApO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcicpIHtcbiAgICAgIHNlbGVjdGVkQ2VsbCA9IHBsYXllck9uZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEtY29vcj0nJHt4UG9zKyt9ICR7eVBvc30nXWBcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdob3InKSB7XG4gICAgICBzZWxlY3RlZENlbGwgPSBwbGF5ZXJPbmVDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLWNvb3I9JyR7eFBvc30gJHt5UG9zKyt9J11gXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChzZWxlY3RlZENlbGwgPT09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzZWxlY3RlZENlbGwuY2xhc3NMaXN0LmFkZCgncGxhY2luZycpO1xuICB9XG59O1xuXG5jb25zdCBwbGF5ZXJNb3ZlU2hpcCA9IChzaGlwTGVuZ3RoLCBzaGlwUGxhY2VkLCBwbGF5ZXIpID0+IHtcbiAgbGV0IGRpcmVjdGlvbiA9ICd2ZXInO1xuXG4gIGNvbnN0IGNoYW5nZUhvdmVyRGlyZWN0aW9uID0gKGUpID0+IHtcbiAgICBpZiAoZS5rZXkgPT09ICdyJykge1xuICAgICAgZGlyZWN0aW9uID09PSAndmVyJyA/IChkaXJlY3Rpb24gPSAnaG9yJykgOiAoZGlyZWN0aW9uID0gJ3ZlcicpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBfcGxhY2VMaXN0ZW5lciA9IChwbGFjZUNlbGwpID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBwbGFjZUNlbGwudGFyZ2V0O1xuICAgIGNvbnN0IHNoaXAgPSBzaGlwUGxhY2VkO1xuICAgIGlmIChuZXdTaGlwUG9zKHRhcmdldCwgc2hpcCwgcGxheWVyLCBkaXJlY3Rpb24pKSB7XG4gICAgICBwbGF5ZXJPbmVDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBjaGFuZ2VIb3ZlckRpcmVjdGlvbik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IF9ob3Zlckxpc3RlbmVyID0gKGUpID0+IHtcbiAgICBjb25zdCBwbGFjZUNlbGwgPSBlLnRhcmdldDtcbiAgICBjb25zdCBsZW5ndGggPSBzaGlwTGVuZ3RoO1xuICAgIGFkZEhvdmVyRWZmZWN0KGxlbmd0aCwgcGxhY2VDZWxsLCBkaXJlY3Rpb24pO1xuXG4gICAgcGxhY2VDZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3BsYWNlTGlzdGVuZXIpO1xuICB9O1xuXG4gIGNvbnN0IHJlbW92ZUhvdmVyRWZmZWN0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGNlbGxzID0gcGxheWVyT25lQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5jZWxsJyk7XG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdwbGFjaW5nJyk7XG4gICAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX3BsYWNlTGlzdGVuZXIpO1xuICAgIH0pO1xuICB9O1xuXG4gIGlmIChwbGF5ZXJPbmVDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcnMpIHtcbiAgICBwbGF5ZXJPbmVDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHBsYXllck9uZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBfaG92ZXJMaXN0ZW5lcik7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBjaGFuZ2VIb3ZlckRpcmVjdGlvbik7XG5cbiAgcGxheWVyT25lQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXJzID0gKCkgPT4ge1xuICAgIHBsYXllck9uZUNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBfaG92ZXJMaXN0ZW5lcik7XG4gICAgcmVtb3ZlSG92ZXJFZmZlY3QoKTtcbiAgfTtcblxuICAvLyByZW1vdmUgdGhlIGhvdmVyIGVmZmVjdCBvbiBjZWxscyBhZnRlciBtb3VzZW91dFxuICBwbGF5ZXJPbmVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCByZW1vdmVIb3ZlckVmZmVjdCk7XG59O1xuXG5jb25zdCByZW1vdmVPbGRTaGlwUG9zID0gKG9sZFNoaXBQb3NBcnJheSkgPT4ge1xuICBjb25zdCBwb3NpdGlvbnNUb1JlbW92ZSA9IG9sZFNoaXBQb3NBcnJheTtcbiAgcG9zaXRpb25zVG9SZW1vdmUuZm9yRWFjaCgocG9zKSA9PiB7XG4gICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvb3I9JyR7cG9zWzBdfSAke3Bvc1sxXX0nXWApO1xuICAgIGNlbGwucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICAgIGNvbnN0IGNsb25lID0gY2VsbC5jbG9uZU5vZGUoZmFsc2UpO1xuICAgIGNlbGwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoY2xvbmUsIGNlbGwpO1xuICB9KTtcbiAgLy8gY2xlYW5pbmcgb2xkIHBvc2l0aW9ucyBvZiB0aGUgcmVsb2NhdGVkIHNoaXAsIHJlbW92aW5nIGl0cyBpZCBhbmQgcmVwbGFjaW5nIGl0IHdpdGggYSBub2RlIGNsb25lLFxuICAvLyB0byByZW1vdmUgaXRzIGV2ZW50TGlzdGVuZXJzLCBub3QgdGhlIGJlc3Qgd2F5IG9mIGRvaW5nIHRoaXNcbn07XG5cbmNvbnN0IG5ld1NoaXBQb3MgPSAodGFyZ2V0LCBzaGlwLCBwbGF5ZXIsIGRpcmVjdGlvbikgPT4ge1xuICBjb25zdCB0YXJnZXRDZWxsID0gdGFyZ2V0LmRhdGFzZXQuY29vcjtcbiAgY29uc3QgdGFyZ2V0U2hpcCA9IHNoaXAuZ2V0U2hpcENsYXNzKCk7XG4gIGNvbnN0IHBvcyA9IFtOdW1iZXIodGFyZ2V0Q2VsbFswXSksIE51bWJlcih0YXJnZXRDZWxsWzJdKV07XG5cbiAgY29uc3Qgb2xkU2hpcFBvc0FycmF5ID0gW107XG5cbiAgY29uc3QgZ2V0U2hpcCA9IHBsYXllci5wbGF5ZXJCb2FyZC5nZXRTaGlwKHRhcmdldFNoaXApOyAvLyBzdG9yZSB0aGUgb2xkIHNoaXBcbiAgY29uc3Qgb2xkU2hpcFBvc2l0aW9ucyA9IGdldFNoaXAubGVuZ3RoO1xuICBvbGRTaGlwUG9zaXRpb25zLmZvckVhY2goKHBvcykgPT4ge1xuICAgIG9sZFNoaXBQb3NBcnJheS5wdXNoKHBvcyk7XG4gIH0pO1xuXG4gIGxldCBuZXdTaGlwUG9zO1xuXG4gIGlmIChkaXJlY3Rpb24gPT09ICd2ZXInKSB7XG4gICAgbmV3U2hpcFBvcyA9IHBsYXllci5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAodGFyZ2V0U2hpcCwgcG9zLCAndmVyJyk7XG4gIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnaG9yJykge1xuICAgIG5ld1NoaXBQb3MgPSBwbGF5ZXIucGxheWVyQm9hcmQucGxhY2VTaGlwKHRhcmdldFNoaXAsIHBvcywgJ2hvcicpO1xuICB9XG5cbiAgaWYgKG5ld1NoaXBQb3MgIT09IGZhbHNlKSB7XG4gICAgcmVtb3ZlT2xkU2hpcFBvcyhvbGRTaGlwUG9zQXJyYXkpO1xuICAgIHBsYWNlU2hpcHMocGxheWVyLCBnZXRTaGlwKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbmNvbnN0IHBsYWNlU2hpcHMgPSAocGxheWVyLCBzaGlwKSA9PiB7XG4gIGNvbnN0IHNoaXBQbGFjZWQgPSBzaGlwO1xuICBjb25zdCBwbGF5ZXJDb250YWluZXIgPSBnZXRQbGF5ZXJDb250YWluZXIocGxheWVyKTtcbiAgbGV0IHNoaXBOYW1lID0gc2hpcC5zaGlwQ2xhc3M7XG4gIGNvbnN0IHNoaXBQb3NpdGlvbnMgPSBzaGlwUGxhY2VkLmxlbmd0aDsgLy8gZ2V0IHRoZSBsZW5ndGggb2YgdGhlIHNoaXAgLy8gbGVuZ3RoIGlzIGFsc28gYXJyYXkgb2YgdGhlIHBvc2l0aW9ucyBhcyBpbiBbMywgNV0gZXRjLlxuICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcFBsYWNlZC5sZW5ndGgubGVuZ3RoO1xuXG4gIHNoaXBQb3NpdGlvbnMuZm9yRWFjaCgocG9zKSA9PiB7XG4gICAgY29uc3QgeFBvcyA9IHBvc1swXTsgLy8gc3RvcmUgdGhlIGZpcnN0IGNvb3JkaW5hdGUgZXhwOiBbMywgNV0gc3RvcmUgM1xuICAgIGNvbnN0IHlQb3MgPSBwb3NbMV07IC8vIHN0b3JlIHRoZSBzZWNvbmQgY29vcmRpbmF0ZVxuICAgIGNvbnN0IGRhdGFJRCA9IGAke3hQb3N9ICR7eVBvc31gOyAvLyBzdG9yZSBib3RoIG9mIHRoZSBjb29yZGluYXRlcyBpbnRvIGEgc3RyaW5nIGV4cDogMyA1XG5cbiAgICBjb25zdCBjaGlsZCA9IHBsYXllckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbZGF0YS1jb29yPScke2RhdGFJRH0nXWApOyAvLyBeIHN0b3JlIHRoZSBjaGlsZCBkaXYgb2YgdGhlIHBsYXllckNvbnRhaW5lciB3aXRoIHRoZSBjdXJyZW50IGRhdGFJRFxuICAgIGNoaWxkLnNldEF0dHJpYnV0ZSgnaWQnLCBgJHtzaGlwTmFtZX1gKTsgLy8gc2V0IHRoZSBkaXYncyBpZCB3aXRoIHRoZSBuYW1lIG9mIHRoZSBzaGlwIGJlaW5nIHBsYWNlZFxuICAgIGNoaWxkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIHBsYXllck1vdmVTaGlwKHNoaXBMZW5ndGgsIHNoaXBQbGFjZWQsIHBsYXllcilcbiAgICApO1xuICB9KTtcbiAgLy8gbW9zdCBsaWtlbHkgbm90IHRoZSBiZXN0IHdheSBvZiBkb2luZyB0aGlzLCBidXQgdGhlIG9ubHkgc29sdXRpb24gaSBjYW4gdGhpbmsgb2Yg8J+YlVxufTtcblxuZXhwb3J0IHsgY3JlYXRlUGxheWVyR3JpZCwgcGxhY2VTaGlwcyB9O1xuIiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9zaGlwLmpzJztcblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5nYW1lYm9hcmQgPSB0aGlzLmNvbnN0cnVjdG9yLmNyZWF0ZUdhbWVib2FyZCgpO1xuICAgIHRoaXMuc2hpcHMgPSBbXTtcbiAgICB0aGlzLm1pc3NlZFNob3RzID0gW107IC8vIGZvcmdvdCBhYm91dCB0aGlzIGFuZCBkaWRuJ3QgdXNlIGl0IHRvIHZpc3VhbGl6ZSBtaXNzZWQgaGl0c1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUdhbWVib2FyZCgpIHtcbiAgICBjb25zdCBib2FyZCA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSArPSAxKSB7XG4gICAgICBib2FyZFtpXSA9IFtdO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaiArPSAxKSB7XG4gICAgICAgIGJvYXJkW2ldW2pdID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJvYXJkO1xuICB9XG5cbiAgcGxhY2VTaGlwKHMsIFt4LCB5XSwgZGlyKSB7XG4gICAgbGV0IG5ld1NoaXA7XG5cbiAgICBjb25zdCBjaGVja1NoaXBFeGlzdHMgPSB0aGlzLmdldFNoaXAocyk7XG4gICAgaWYgKCEhY2hlY2tTaGlwRXhpc3RzKSB7XG4gICAgICBuZXdTaGlwID0gY2hlY2tTaGlwRXhpc3RzO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdTaGlwID0gbmV3IFNoaXAocyk7XG4gICAgfSAvLyBpZiB0aGUgc2hpcCB3ZSBhcmUgZ2l2ZW4gZXhpc3RzIHRoZW4gc2VsZWN0IHRoYXQgc2hpcCwgd2UgYXJlIHJlbG9jYXRpbmcgaXQsIGVsc2UgY3JlYXRlIGEgbmV3IG9uZVxuXG4gICAgbGV0IHhDb29yID0geDtcbiAgICBsZXQgeUNvb3IgPSB5O1xuXG4gICAgY29uc3QgZGlyZWN0aW9uID0gZGlyO1xuICAgIGlmIChkaXJlY3Rpb24gIT09ICd2ZXInICYmIGRpcmVjdGlvbiAhPT0gJ2hvcicpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIGRpcmVjdGlvbiBvbmx5IFwidmVyXCIgb3IgXCJob3JcIicpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBzaGlwTGVuZ3RoID0gbmV3U2hpcC5nZXRMZW5ndGgoKTsgLy8gZ2l2ZXMgdGhlIGxlbmd0aCBvZiB0aGUgc2hpcCwgYXMgaW4gbGVuZ3RoIG9mIHRoZSBhcnJheVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcicpIHtcbiAgICAgIGlmICh5Q29vciA8IDAgfHwgeUNvb3IgPiA5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIFkgY29vcmRpbmF0ZXMnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHhDb29yIC0gMSArIHNoaXBMZW5ndGggPiA5IHx8IHhDb29yIDwgMCkge1xuICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBYIGNvb3JkaW5hdGVzJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcicpIHtcbiAgICAgIGlmICh5Q29vciAtIDEgKyBzaGlwTGVuZ3RoID4gOSB8fCB5Q29vciA8IDApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2ludmFsaWQgWSBjb29yZGluYXRlcycpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoeENvb3IgPCAwIHx8IHhDb29yID4gOSkge1xuICAgICAgICBjb25zb2xlLmxvZygnaW52YWxpZCBYIGNvb3JkaW5hdGVzJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0ZW1wUG9zaXRpb25zID0gW107XG5cbiAgICBpZiAoISFjaGVja1NoaXBFeGlzdHMpIHtcbiAgICAgIG5ld1NoaXAubGVuZ3RoLmZvckVhY2goKHBvcykgPT4ge1xuICAgICAgICB0ZW1wUG9zaXRpb25zLnB1c2gocG9zKTtcbiAgICAgICAgdGhpcy5nYW1lYm9hcmRbcG9zWzBdXVtwb3NbMV1dID0gbnVsbDtcbiAgICAgIH0pO1xuICAgICAgLy8gaWYgdGhlIHNoaXAgd2UgYXJlIGN1cnJlbnRseSBwbGFjaW5nIGV4aXN0cywgbWVhbmluZyB3ZSBhcmUgcmVsb2NhdGluZyBpdCxcbiAgICAgIC8vIHRoZW4gcmVzZXQgaXRzIHBvc2l0aW9uIHNvIGNoZWNrUHJveGltaXR5IGRvZXNuJ3QgY2hlY2sgZm9yIGl0cyBvd24gcG9zaXRpb25cbiAgICAgIC8vIGFuZCBwdXNoIGl0cyBwb3NpdGlvbnMgdG8gYSB0ZW1wIGFycmF5LlxuICAgIH1cbiAgICAvLyBpZiBjaGVja1BpeGltaXR5IHJldHVybnMgdHJ1ZSB0aGVuIHdlIGtub3cgd2UgYXJlIHBsYWNpbmcgb3VyIGN1cnJlbnQgc2hpcCB0b28gY2xvc2UgdG8gYW5vdGhlciBzaGlwLCBleGl0XG4gICAgaWYgKHRoaXMuY2hlY2tQcm94aW1pdHkoW3gsIHldLCBzaGlwTGVuZ3RoLCBkaXJlY3Rpb24pKSB7XG4gICAgICBjb25zb2xlLmxvZygnb2NjdXBpZWQgYnkgc2hpcCBuZWFyYnkgKHNpZGVzIG9yIHRvcC9ib3R0b20gYW5kIGVkZ2VzKScpO1xuICAgICAgLy8gaWYgd2UgdGVtcFBvc2l0aW9ucyBoYXMgbGVuZ3RoLCBtZWFuaW5nIHdlIGZhaWxlZCB0byByZWxvY2F0ZSBhbiBleGlzdGluZyBzaGlwLFxuICAgICAgLy8gdGhlbiBwdXNoIHRoYXQgZXhpc3Rpbmcgc2hpcCdzIHBvc2l0aW9ucyBiYWNrIHRvIHRoZSBnYW1lYm9hcmQuXG4gICAgICBpZiAodGVtcFBvc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgdGVtcFBvc2l0aW9ucy5mb3JFYWNoKChwb3MpID0+IHtcbiAgICAgICAgICB0aGlzLmdhbWVib2FyZFtwb3NbMF1dW3Bvc1sxXV0gPSBuZXdTaGlwLmdldFNoaXBOYW1lKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIHJlc2V0IHNoaXAncyBsZW5ndGggc2luY2Ugd2UgaGF2ZSBpdCBzYXZlZCBhdCB2YXJpYWJsZSBzaGlwTGVuZ3RoXG4gICAgLy8gYW5kIGZpbGwgdGhlIGxlbmd0aCBhcnJheSB3aXRoIHRoaXMgc2hpcCdzIHBvc2l0aW9uXG4gICAgbmV3U2hpcC5sZW5ndGggPSBbXTtcbiAgICB3aGlsZSAoc2hpcExlbmd0aCA+IDApIHtcbiAgICAgIG5ld1NoaXAubGVuZ3RoLnB1c2goW3hDb29yLCB5Q29vcl0pO1xuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcicpIHtcbiAgICAgICAgdGhpcy5nYW1lYm9hcmRbeENvb3JdW3lDb29yXSA9IG5ld1NoaXAuZ2V0U2hpcE5hbWUoKTtcbiAgICAgICAgeENvb3IgKz0gMTtcbiAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnaG9yJykge1xuICAgICAgICB0aGlzLmdhbWVib2FyZFt4Q29vcl1beUNvb3JdID0gbmV3U2hpcC5nZXRTaGlwTmFtZSgpO1xuICAgICAgICB5Q29vciArPSAxO1xuICAgICAgfVxuICAgICAgc2hpcExlbmd0aCAtPSAxO1xuICAgIH1cblxuICAgIGlmICghY2hlY2tTaGlwRXhpc3RzKSB7XG4gICAgICB0aGlzLnNoaXBzLnB1c2gobmV3U2hpcCk7XG4gICAgfSAvLyBvbmx5IHB1c2ggY3VycmVudCBzaGlwIHRvIHNoaXBzIGlmIGl0J3MgYSBuZXcgc2hpcFxuICB9XG5cbiAgY2hlY2tQcm94aW1pdHkoW3gsIHldLCBzaGlwTGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICBsZXQgeENvb3IgPSB4O1xuICAgIGxldCB5Q29vciA9IHk7XG4gICAgbGV0IGxlbmd0aCA9IHNoaXBMZW5ndGg7XG4gICAgbGV0IG1vdmVzID0gW107XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcicpIHtcbiAgICAgIG1vdmVzID0gW1xuICAgICAgICB7IHg6IHhDb29yIC0gMSwgeTogeUNvb3IgfSxcbiAgICAgICAgeyB4OiB4Q29vciAtIDEsIHk6IHlDb29yIC0gMSB9LFxuICAgICAgICB7IHg6IHhDb29yIC0gMSwgeTogeUNvb3IgKyAxIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnaG9yJykge1xuICAgICAgbW92ZXMgPSBbXG4gICAgICAgIHsgeDogeENvb3IsIHk6IHlDb29yIC0gMSB9LFxuICAgICAgICB7IHg6IHhDb29yIC0gMSwgeTogeUNvb3IgLSAxIH0sXG4gICAgICAgIHsgeDogeENvb3IgKyAxLCB5OiB5Q29vciAtIDEgfSxcbiAgICAgIF07XG4gICAgfSAvLyBeIHN0YW5kYXJkIHBvc2l0aW9ucyBmb3IgdG9wIHBhcnQgb2YgdGhlIHNoaXAuXG5cbiAgICB3aGlsZSAobGVuZ3RoID4gMCkge1xuICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3ZlcicpIHtcbiAgICAgICAgbW92ZXMucHVzaCh7IHg6IHhDb29yLCB5OiB5Q29vciAtIDEgfSwgeyB4OiB4Q29vciwgeTogeUNvb3IgKyAxIH0pOyAvLyBwb3NpdGlvbnMgZm9yIHNpZGVzIG9mIHRoZSBzaGlwXG4gICAgICAgIG1vdmVzLnB1c2goeyB4OiB4Q29vciwgeTogeUNvb3IgfSk7IC8vIHBvc2l0aW9ucyBmb3IgdGhlIHNoaXAgaXRzZWxmXG4gICAgICAgIHhDb29yICs9IDE7XG4gICAgICAgIGlmIChsZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBtb3Zlcy5wdXNoKFxuICAgICAgICAgICAgeyB4OiB4Q29vciwgeTogeUNvb3IgfSxcbiAgICAgICAgICAgIHsgeDogeENvb3IsIHk6IHlDb29yIC0gMSB9LFxuICAgICAgICAgICAgeyB4OiB4Q29vciwgeTogeUNvb3IgKyAxIH1cbiAgICAgICAgICApOyAvLyBeIHBvc2l0aW9ucyBmb3IgdGhlIGJvdHRvbSBwYXJ0IG9mIHRoZSBzaGlwLlxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcicpIHtcbiAgICAgICAgbW92ZXMucHVzaCh7IHg6IHhDb29yIC0gMSwgeTogeUNvb3IgfSwgeyB4OiB4Q29vciArIDEsIHk6IHlDb29yIH0pOyAvLyBwb3NpdGlvbnMgZm9yIHNpZGVzIG9mIHRoZSBzaGlwXG4gICAgICAgIG1vdmVzLnB1c2goeyB4OiB4Q29vciwgeTogeUNvb3IgfSk7IC8vIHBvc2l0aW9ucyBmb3IgdGhlIHNoaXAgaXRzZWxmXG4gICAgICAgIHlDb29yICs9IDE7XG4gICAgICAgIGlmIChsZW5ndGggPT09IDEpIHtcbiAgICAgICAgICBtb3Zlcy5wdXNoKFxuICAgICAgICAgICAgeyB4OiB4Q29vciwgeTogeUNvb3IgfSxcbiAgICAgICAgICAgIHsgeDogeENvb3IgLSAxLCB5OiB5Q29vciB9LFxuICAgICAgICAgICAgeyB4OiB4Q29vciArIDEsIHk6IHlDb29yIH1cbiAgICAgICAgICApOyAvLyBeIHBvc2l0aW9ucyBmb3IgdGhlIGJvdHRvbSBwYXJ0IG9mIHRoZSBzaGlwLlxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxlbmd0aCAtPSAxO1xuICAgIH1cblxuICAgIGNvbnN0IHNlYXJjaEFyb3VuZCA9IG1vdmVzLnNvbWUoKG0pID0+IHtcbiAgICAgIGxldCB7IGNoZWNrWCB9ID0gbTtcbiAgICAgIGNoZWNrWCA9IG0ueDtcbiAgICAgIGxldCB7IGNoZWNrWSB9ID0gbTtcbiAgICAgIGNoZWNrWSA9IG0ueTtcblxuICAgICAgLy8gaWYgd2UgYXJlIHNlYXJjaGluZyBmb3Igb3V0IG9mIGdhbWVib2FyZCBib3JkZXIganVzdCBza2lwXG4gICAgICBpZiAoY2hlY2tYIDwgMCB8fCBjaGVja1ggPiA5IHx8IGNoZWNrWSA8IDAgfHwgY2hlY2tZID4gOSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmdhbWVib2FyZFtjaGVja1hdW2NoZWNrWV0gIT09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgYCR7dGhpcy5nYW1lYm9hcmRbY2hlY2tYXVtjaGVja1ldfSAke2NoZWNrWH0gLyAke2NoZWNrWX0gRklMTEVEYFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gcmV0dXJuIHRydWUgaWYgdGhlcmUgaXMgYSBzaGlwIG5lYXJieVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHNlYXJjaEFyb3VuZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmVjZWl2ZUF0dGFjayhbeCwgeV0pIHtcbiAgICBjb25zdCB4Q29vciA9IHg7XG4gICAgY29uc3QgeUNvb3IgPSB5O1xuICAgIGlmICh4Q29vciA+IDkgfHwgeENvb3IgPCAwIHx8IHlDb29yID4gOSB8fCB5Q29vciA8IDApIHtcbiAgICAgIGNvbnNvbGUubG9nKCdpbnZhbGlkIGNvb3JkaW5hdGVzJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGhpdENvb3IgPSB0aGlzLmdhbWVib2FyZFt4Q29vcl1beUNvb3JdO1xuXG4gICAgaWYgKGhpdENvb3IgIT09IG51bGwpIHtcbiAgICAgIGxldCBzaGlwSGl0O1xuICAgICAgaWYgKGhpdENvb3IgPT09ICdDYXInKSB7XG4gICAgICAgIHNoaXBIaXQgPSAnQ2Fycmllcic7XG4gICAgICB9IGVsc2UgaWYgKGhpdENvb3IgPT09ICdCYXQnKSB7XG4gICAgICAgIHNoaXBIaXQgPSAnQmF0dGxlc2hpcCc7XG4gICAgICB9IGVsc2UgaWYgKGhpdENvb3IgPT09ICdEZXMnKSB7XG4gICAgICAgIHNoaXBIaXQgPSAnRGVzdHJveWVyJztcbiAgICAgIH0gZWxzZSBpZiAoaGl0Q29vciA9PT0gJ1N1YicpIHtcbiAgICAgICAgc2hpcEhpdCA9ICdTdWJtYXJpbmUnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2hpcEhpdCA9ICdQYXRyb2xCb2F0JztcbiAgICAgIH1cblxuICAgICAgc2hpcEhpdCA9IHRoaXMuZ2V0U2hpcChzaGlwSGl0KTtcbiAgICAgIGxldCBjb3VudGVyID0gMTtcbiAgICAgIHNoaXBIaXQubGVuZ3RoLnNvbWUoKHBvcykgPT4ge1xuICAgICAgICBpZiAocG9zWzBdID09PSB4Q29vciAmJiBwb3NbMV0gPT09IHlDb29yKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTsgLy8gXiBmaW5kIHdoaWNoIHBvc2l0aW9uIHdlIGFyZSBoaXR0aW5nIHRoZSBzaGlwIGZyb21cbiAgICAgIHNoaXBIaXQuaGl0KGNvdW50ZXIpO1xuICAgICAgdGhpcy5nYW1lYm9hcmRbeENvb3JdW3lDb29yXSA9ICdoaXQnOyAvLyB1cGRhdGUgZ2FtZWJvYXJkIHRvIGRpc3BsYXkgJ2hpdCdcblxuICAgICAgY29uc29sZS5sb2coYGhpdHRpbmcgJHtzaGlwSGl0LnNoaXBDbGFzc30gZnJvbSBwb3NpdGlvbiAke2NvdW50ZXJ9YCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5taXNzZWRTaG90cy5wdXNoKFt4Q29vciwgeUNvb3JdKTsgLy8ga2luZCBvZiBmb3Jnb3QgYWJvdXQgdGhpcywgdGhpcyBpcyBub3QgYmVpZ24gdXNlZFxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMubWlzc2VkU2hvdHMpO1xuICAgIGNvbnNvbGUubG9nKCdoaXQgbWlzc2VkJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY2hlY2tBbGxTaGlwc1N1bmsoKSB7XG4gICAgY29uc3Qgc2hpcHMgPSB0aGlzLnNoaXBzO1xuXG4gICAgY29uc3QgQWxsU2hpcHNDaGVjayA9IHNoaXBzLmV2ZXJ5KChzaGlwKSA9PiB7XG4gICAgICBpZiAoc2hpcC5pc1N1bmsgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gICAgaWYgKEFsbFNoaXBzQ2hlY2sgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRTaGlwKHNoaXApIHtcbiAgICBjb25zdCBhbGxTaGlwcyA9IHRoaXMuc2hpcHM7XG5cbiAgICBjb25zdCBmaW5kU2hpcCA9IChlbGVtZW50KSA9PiBlbGVtZW50LnNoaXBDbGFzcyA9PT0gc2hpcDtcbiAgICBjb25zdCBjaGVja1NoaXBFeGlzdHMgPSBhbGxTaGlwcy5maW5kKGZpbmRTaGlwKTtcbiAgICBpZiAoY2hlY2tTaGlwRXhpc3RzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdubyBzdWNoIHNoaXAnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGNoZWNrU2hpcEV4aXN0cztcbiAgfVxuXG4gIHJlbW92ZVNoaXAoc2hpcCkge1xuICAgIGNvbnN0IHNoaXBUb0JlUmVtb3ZlZCA9IHRoaXMuZ2V0U2hpcChzaGlwKTtcbiAgICBjb25zdCBwb3NpdGlvbnNPZlRoZVNoaXAgPSBzaGlwVG9CZVJlbW92ZWQubGVuZ3RoO1xuXG4gICAgcG9zaXRpb25zT2ZUaGVTaGlwLmZvckVhY2goKHBvcykgPT4ge1xuICAgICAgdGhpcy5nYW1lYm9hcmRbcG9zWzBdXVtwb3NbMV1dID0gbnVsbDtcbiAgICB9KTtcbiAgICB0aGlzLnNoaXBzLnNwbGljZSh0aGlzLnNoaXBzLmluZGV4T2Yoc2hpcFRvQmVSZW1vdmVkKSwgMSk7IC8vIHJlbW92ZSB0aGUgc2hpcFxuICB9XG59XG5cbi8vIGNvbnN0IGdhbWVib2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbi8vIGdhbWVib2FyZC5wbGFjZVNoaXAoJ0NhcnJpZXInLCBbMCwgMF0sICdob3InKTtcbi8vIGdhbWVib2FyZC5wbGFjZVNoaXAoJ0JhdHRsZXNoaXAnLCBbNiwgMl0sICd2ZXInKTtcbi8vIGdhbWVib2FyZC5wbGFjZVNoaXAoJ0Rlc3Ryb3llcicsIFsyLCAxXSwgJ3ZlcicpO1xuLy8gZ2FtZWJvYXJkLnBsYWNlU2hpcCgnU3VibWFyaW5lJywgWzUsIDZdLCAndmVyJyk7XG4vLyBnYW1lYm9hcmQucGxhY2VTaGlwKCdQYXRyb2xCb2F0JywgWzgsIDldLCAndmVyJyk7XG5cbi8vIGdhbWVib2FyZC5wbGFjZVNoaXAoJ1N1Ym1hcmluZScsIFs0LCA4XSwgJ3ZlcicpO1xuXG4vLyAvLyAvLyBnYW1lYm9hcmQucmVtb3ZlU2hpcCgnU3VibWFyaW5lJyk7XG5cbi8vIC8vIC8vIGdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKFszLCAyXSk7XG5cbi8vIGdhbWVib2FyZC5nYW1lYm9hcmQuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuLy8gICBjb25zb2xlLmxvZyhlbGVtZW50KTtcbi8vIH0pO1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7XG4iLCJpbXBvcnQgR2FtZWJvYXJkIGZyb20gJy4vZ2FtZWJvYXJkLmpzJztcblxuY2xhc3MgUGxheWVyIHtcbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHRoaXMucGxheWVyQm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgdGhpcy5vcHBvbmVudCA9IG51bGw7XG4gICAgdGhpcy5hbGxTaG90cyA9IFtdO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy53aW5uZXIgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIGdldFR1cm4oKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMub3Bwb25lbnQ7XG4gIC8vIH1cblxuICBnZXROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWU7XG4gIH1cblxuICBhdHRhY2tzKFt4LCB5XSkge1xuICAgIGlmICh0aGlzLmNoZWNrQWxyZWFkeVNob3QoW3gsIHldKSkge1xuICAgICAgcmV0dXJuO1xuICAgICAgLy8gaWYgdGhlIFt4LCB5XSBwb3NpdGlvbiBpcyBhbHJlYWR5IHNob3QgYXQgcmV0dXJuIC8vIGV4aXRcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hbGxTaG90cy5wdXNoKFt4LCB5XSk7XG4gICAgICBjb25zdCBhdHRhY2tPcHBvbmVudCA9IHRoaXMub3Bwb25lbnQucGxheWVyQm9hcmQucmVjZWl2ZUF0dGFjayhbeCwgeV0pOyAvLyByZXR1cm5zIHRydWUgaWYgc2hvdCBoaXQsIGZhbHNlIGlmIGl0IGRpZG4ndFxuICAgICAgY29uc3QgaXNBbGxPcHBvbmVudFNoaXBzU3VuayA9XG4gICAgICAgIHRoaXMub3Bwb25lbnQucGxheWVyQm9hcmQuY2hlY2tBbGxTaGlwc1N1bmsoKTsgLy8gcmV0dXJucyB0cnVlIGlmIGFsbCBzaGlwcyBhcmUgc3VuaywgZmFsc2Ugb3RoZXJ3aXNlXG5cbiAgICAgIGlmIChpc0FsbE9wcG9uZW50U2hpcHNTdW5rKSB0aGlzLndpbm5lciA9IHRydWU7XG4gICAgICByZXR1cm4gYXR0YWNrT3Bwb25lbnQ7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tBbHJlYWR5U2hvdChbeCwgeV0pIHtcbiAgICBjb25zdCBjaGVja0FscmVhZHlTaG90ID0gdGhpcy5hbGxTaG90cy5zb21lKChzaG90KSA9PiB7XG4gICAgICBpZiAoc2hvdFswXSA9PT0geCAmJiBzaG90WzFdID09PSB5KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgaWYgKGNoZWNrQWxyZWFkeVNob3QgPT09IHRydWUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdwb3NpdGlvbiBpcyBhbHJlYWR5IHNob3QgYXQnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByYW5kb21OdW0oKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgfVxuXG4gIHJhbmRvbURpcigpIHtcbiAgICBjb25zdCBteUFycmF5ID0gWyd2ZXInLCAnaG9yJ107XG4gICAgcmV0dXJuIG15QXJyYXlbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbXlBcnJheS5sZW5ndGgpXTtcbiAgfVxuXG4gIEFJUGxhY2VTaGlwcygpIHtcbiAgICBjb25zdCBwbGFjZUNhcnJpZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLnBsYXllckJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgJ0NhcnJpZXInLFxuICAgICAgICBbdGhpcy5yYW5kb21OdW0oKSwgdGhpcy5yYW5kb21OdW0oKV0sXG4gICAgICAgIHRoaXMucmFuZG9tRGlyKClcbiAgICAgICk7XG4gICAgfTtcblxuICAgIGNvbnN0IHBsYWNlQmF0dGxlc2hpcCA9ICgpID0+IHtcbiAgICAgIHRoaXMucGxheWVyQm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAnQmF0dGxlc2hpcCcsXG4gICAgICAgIFt0aGlzLnJhbmRvbU51bSgpLCB0aGlzLnJhbmRvbU51bSgpXSxcbiAgICAgICAgdGhpcy5yYW5kb21EaXIoKVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3QgcGxhY2VEZXN0cm95ZXIgPSAoKSA9PiB7XG4gICAgICB0aGlzLnBsYXllckJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgJ0Rlc3Ryb3llcicsXG4gICAgICAgIFt0aGlzLnJhbmRvbU51bSgpLCB0aGlzLnJhbmRvbU51bSgpXSxcbiAgICAgICAgdGhpcy5yYW5kb21EaXIoKVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3QgcGxhY2VTdWJtYXJpbmUgPSAoKSA9PiB7XG4gICAgICB0aGlzLnBsYXllckJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgJ1N1Ym1hcmluZScsXG4gICAgICAgIFt0aGlzLnJhbmRvbU51bSgpLCB0aGlzLnJhbmRvbU51bSgpXSxcbiAgICAgICAgdGhpcy5yYW5kb21EaXIoKVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3QgcGxhY2VQYXRyb2xCb2F0ID0gKCkgPT4ge1xuICAgICAgdGhpcy5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICdQYXRyb2xCb2F0JyxcbiAgICAgICAgW3RoaXMucmFuZG9tTnVtKCksIHRoaXMucmFuZG9tTnVtKCldLFxuICAgICAgICB0aGlzLnJhbmRvbURpcigpXG4gICAgICApO1xuICAgIH07XG5cbiAgICBjb25zdCBhbGxTaGlwcyA9IHRoaXMucGxheWVyQm9hcmQuc2hpcHM7XG4gICAgY29uc3Qgc2hpcHNUb0FkZCA9IFtcbiAgICAgICdDYXJyaWVyJyxcbiAgICAgICdCYXR0bGVzaGlwJyxcbiAgICAgICdEZXN0cm95ZXInLFxuICAgICAgJ1N1Ym1hcmluZScsXG4gICAgICAnUGF0cm9sQm9hdCcsXG4gICAgXTtcblxuICAgIHdoaWxlIChhbGxTaGlwcy5sZW5ndGggIT09IDUpIHtcbiAgICAgIGFsbFNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgY29uc3Qgc2hpcE5hbWUgPSBzaGlwLmdldFNoaXBDbGFzcygpO1xuICAgICAgICBpZiAoc2hpcHNUb0FkZC5pbmNsdWRlcyhzaGlwTmFtZSkpIHtcbiAgICAgICAgICBzaGlwc1RvQWRkLnNwbGljZShzaGlwc1RvQWRkLmluZGV4T2Yoc2hpcE5hbWUpLCAxKTsgLy8gcmVtb3ZlIHRoZSBzaGlwXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc2hpcHNUb0FkZC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgIGlmIChzaGlwID09PSAnQ2FycmllcicpIHtcbiAgICAgICAgICBwbGFjZUNhcnJpZXIoKTtcbiAgICAgICAgfSBlbHNlIGlmIChzaGlwID09PSAnQmF0dGxlc2hpcCcpIHtcbiAgICAgICAgICBwbGFjZUJhdHRsZXNoaXAoKTtcbiAgICAgICAgfSBlbHNlIGlmIChzaGlwID09PSAnRGVzdHJveWVyJykge1xuICAgICAgICAgIHBsYWNlRGVzdHJveWVyKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoc2hpcCA9PT0gJ1N1Ym1hcmluZScpIHtcbiAgICAgICAgICBwbGFjZVN1Ym1hcmluZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHNoaXAgPT09ICdQYXRyb2xCb2F0Jykge1xuICAgICAgICAgIHBsYWNlUGF0cm9sQm9hdCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBBSUF0dGFja3MoKSB7XG4gICAgY29uc3QgYXR0YWNrQ29vciA9IFt0aGlzLnJhbmRvbU51bSgpLCB0aGlzLnJhbmRvbU51bSgpXTtcbiAgICBpZiAodGhpcy5jaGVja0FscmVhZHlTaG90KFthdHRhY2tDb29yWzBdLCBhdHRhY2tDb29yWzFdXSkpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdBSSBpcyBnb25uYSByZXRyeSBoaXR0aW5nJyk7XG4gICAgICByZXR1cm4gdGhpcy5BSUF0dGFja3MoKTsgLy8gZG8gQUlBdHRhY2tzIHVudGlsIEFJIGhpdHMgd2l0aCBhdmFpbGFibGUgcG9zaXRpb25cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hdHRhY2tzKGF0dGFja0Nvb3IpO1xuICAgICAgcmV0dXJuIGF0dGFja0Nvb3I7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImNsYXNzIFNoaXAge1xuICBjb25zdHJ1Y3RvcihzaGlwQ2xhc3MpIHtcbiAgICB0aGlzLnNoaXBDbGFzcyA9IHNoaXBDbGFzcztcbiAgICB0aGlzLmxlbmd0aCA9IHRoaXMuYXNzaWduQ2xhc3NMZW5ndGgoKTtcbiAgICB0aGlzLmlzU3VuayA9IGZhbHNlO1xuICB9XG5cbiAgYXNzaWduQ2xhc3NMZW5ndGgoKSB7XG4gICAgaWYgKHRoaXMuc2hpcENsYXNzID09PSAnQ2FycmllcicpIHtcbiAgICAgIHJldHVybiBbMSwgMiwgMywgNCwgNV07XG4gICAgfVxuICAgIGlmICh0aGlzLnNoaXBDbGFzcyA9PT0gJ0JhdHRsZXNoaXAnKSB7XG4gICAgICByZXR1cm4gWzEsIDIsIDMsIDRdO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaGlwQ2xhc3MgPT09ICdEZXN0cm95ZXInKSB7XG4gICAgICByZXR1cm4gWzEsIDIsIDNdO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaGlwQ2xhc3MgPT09ICdTdWJtYXJpbmUnKSB7XG4gICAgICByZXR1cm4gWzEsIDIsIDNdO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaGlwQ2xhc3MgPT09ICdQYXRyb2xCb2F0Jykge1xuICAgICAgcmV0dXJuIFsxLCAyXTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnNvbGUubG9nKCdzb21ldGhpbmcgd2VudCB3cm9uZycpO1xuICB9XG5cbiAgZ2V0TGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aC5sZW5ndGg7XG4gIH1cblxuICBnZXRTaGlwTmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaGlwQ2xhc3Muc2xpY2UoMCwgMyk7XG4gIH1cblxuICBnZXRTaGlwQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpcENsYXNzO1xuICB9XG5cbiAgaGl0KG51bSkge1xuICAgIGlmICh0aGlzLmxlbmd0aC5sZW5ndGggPj0gbnVtICYmIG51bSA+IDApIHtcbiAgICAgIHRoaXMubGVuZ3RoW251bSAtIDFdID0gJ2hpdCc7XG4gICAgICB0aGlzLnN1bmsoKTtcbiAgICB9XG4gIH1cblxuICBzdW5rKCkge1xuICAgIGNvbnN0IGNoZWNrU3VuayA9IChjdXJyZW50KSA9PiBjdXJyZW50ID09PSAnaGl0JztcblxuICAgIGlmICh0aGlzLmxlbmd0aC5ldmVyeShjaGVja1N1bmspKSB0aGlzLmlzU3VuayA9IHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL2Nzcy9zdHlsZS5jc3MnO1xuaW1wb3J0ICcuL2luZGV4Lmh0bWwnO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL2NvbXBvbmVudHMvcGxheWVyLmpzJztcbmltcG9ydCB7IGNyZWF0ZVBsYXllckdyaWQsIHBsYWNlU2hpcHMgfSBmcm9tICcuL2NvbXBvbmVudHMvZG9tLW1hbmlwdWxhdGlvbi5qcyc7XG5cbmNvbnN0IE5ld1BsYXllciA9IFBsYXllcjtcblxuY29uc3QgcGxheWVyT25lID0gbmV3IE5ld1BsYXllcignSHVtYW4nKTtcbmNvbnN0IHBsYXllckFJID0gbmV3IE5ld1BsYXllcignQ29tcHV0ZXInKTtcbnBsYXllck9uZS5vcHBvbmVudCA9IHBsYXllckFJO1xucGxheWVyQUkub3Bwb25lbnQgPSBwbGF5ZXJPbmU7XG5cbmNvbnN0IGdhbWVTdGFydCA9IHtcbiAgaW5pdCgpIHtcbiAgICBjcmVhdGVQbGF5ZXJHcmlkKHBsYXllck9uZSk7XG4gICAgY3JlYXRlUGxheWVyR3JpZChwbGF5ZXJBSSk7XG5cbiAgICBwbGF5ZXJBSS5BSVBsYWNlU2hpcHMoKTtcbiAgICAvLyB0aGlzLkFJVXBkYXRlRGlzcGxheShwbGF5ZXJBSSk7IC8vIGlmIHlvdSB3YW50IHRvIHZpc3VhbGl6ZSBBSSdzIHNoaXBzXG4gIH0sXG5cbiAgcGxheWVyUGxhY2VTaGlwKHBsYXllciwgc2hpcENsYXNzLCBbeCwgeV0sIGRpcikge1xuICAgIGNvbnN0IHBsYXllckdhbWVib2FyZCA9IHBsYXllci5wbGF5ZXJCb2FyZDtcbiAgICBjb25zdCBzaGlwUGxhY2VkID0gc2hpcENsYXNzO1xuICAgIGNvbnN0IHBvczAgPSB4O1xuICAgIGNvbnN0IHBvczEgPSB5O1xuICAgIGNvbnN0IGRpcmVjdGlvbiA9IGRpcjtcblxuICAgIGlmIChcbiAgICAgIHBsYXllckdhbWVib2FyZC5wbGFjZVNoaXAoc2hpcFBsYWNlZCwgW3BvczAsIHBvczFdLCBkaXJlY3Rpb24pID09PSBmYWxzZVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gcGxhY2UgdGhlIHNoaXAgaW4gcGxheWVycyBnYW1lYm9hcmQgLy8gaWYgZmFsc2UgaXMgcmV0dXJuZWQgdGhlbiBleGl0LCBzb21ldGhpbmcgd2VudCB3cm9uZ1xuXG4gICAgY29uc3Qgc2hpcCA9IHBsYXllckdhbWVib2FyZC5nZXRTaGlwKHNoaXBQbGFjZWQpOyAvLyBzdG9yZSB0aGUgc2hpcFxuICAgIHBsYWNlU2hpcHMocGxheWVyT25lLCBzaGlwKTtcbiAgfSxcblxuICBBSVVwZGF0ZURpc3BsYXkocGxheWVyQUkpIHtcbiAgICBjb25zdCBBSVNoaXBzID0gcGxheWVyQUkucGxheWVyQm9hcmQuc2hpcHM7XG5cbiAgICBBSVNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIHBsYWNlU2hpcHMocGxheWVyQUksIHNoaXApO1xuICAgIH0pO1xuICB9LFxufTtcblxuLy8gY29uc3QgZ2FtZUxvb3AgPSAoKSA9PiB7fTtcblxuZ2FtZVN0YXJ0LmluaXQoKTtcblxuZ2FtZVN0YXJ0LnBsYXllclBsYWNlU2hpcChwbGF5ZXJPbmUsICdDYXJyaWVyJywgWzAsIDBdLCAnaG9yJyk7XG5nYW1lU3RhcnQucGxheWVyUGxhY2VTaGlwKHBsYXllck9uZSwgJ0JhdHRsZXNoaXAnLCBbMSwgN10sICd2ZXInKTtcbmdhbWVTdGFydC5wbGF5ZXJQbGFjZVNoaXAocGxheWVyT25lLCAnRGVzdHJveWVyJywgWzUsIDRdLCAndmVyJyk7XG5nYW1lU3RhcnQucGxheWVyUGxhY2VTaGlwKHBsYXllck9uZSwgJ1N1Ym1hcmluZScsIFszLCAxXSwgJ3ZlcicpO1xuZ2FtZVN0YXJ0LnBsYXllclBsYWNlU2hpcChwbGF5ZXJPbmUsICdQYXRyb2xCb2F0JywgWzQsIDldLCAndmVyJyk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=