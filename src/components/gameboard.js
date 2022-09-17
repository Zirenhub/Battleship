import Ship from './ship.js';

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
      newShip = new Ship(s);
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
// // gameboard.placeShip('Carrier', [3, 3], 'ver');
// // gameboard.placeShip('Battleship', [0, 5], 'hor');
// // gameboard.placeShip('Destroyer', [6, 6], 'ver');
// // gameboard.placeShip('Submarine', [5, 1], 'ver');
// gameboard.placeShip('PatrolBoat', [7, 8], 'ver');
// gameboard.placeShip('Destroyer', [0, 0], 'ver');
// gameboard.placeShip('Destroyer', [3, 5], 'hor');

// // gameboard.removeShip('Submarine');

// // gameboard.receiveAttack([3, 2]);

// gameboard.gameboard.forEach((element) => {
//   console.log(element);
// });

export default Gameboard;
