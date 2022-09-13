import Ship from './ship.js';

class Gameboard {
  constructor() {
    this.gameboard = this.constructor.createGameboard();
    this.ships = [];
    this.missedShots = [];
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
    const findShip = (element) => element.shipClass === s;
    const checkShipExists = this.ships.find(findShip);
    if (checkShipExists !== undefined) {
      console.log('that ship already exists');
      return false;
    }
    let xCoor = x;
    let yCoor = y;

    const direction = dir;
    if (direction !== 'ver' && direction !== 'hor') {
      console.log('invalid direction only "ver" or "hor"');
      return false;
    }

    const newShip = new Ship(s);
    let shipLength = newShip.getLength();

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

    if (this.checkProximity([x, y], shipLength, direction)) {
      console.log('occupied by ship nearby (sides or top/bottom and edges)');
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
    this.ships.push(newShip);
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
        return true;
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
      return;
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
        shipHit = 'Patrol Boat';
      }
      const findShip = (element) => element.shipClass === shipHit;
      const shipIndex = this.ships.findIndex(findShip);
      shipHit = this.ships[shipIndex];
      let counter = 1;
      shipHit.length.some((pos) => {
        if (pos[0] === xCoor && pos[1] === yCoor) {
          return true;
        }
        counter += 1;
        return false;
      });
      shipHit.hit(counter);
      this.gameboard[xCoor][yCoor] = 'hit'; // update gameboard to display 'hit'
      console.log(`hitting ${shipHit.shipClass} from position ${counter}`);
    } else {
      this.missedShots.push([xCoor, yCoor]);
      // console.log(this.missedShots);
      console.log('hit missed');
    }
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
      console.log('no such ship');
      return false;
    }
    return checkShipExists;
  }
}

// const gameboard = new Gameboard();
// gameboard.placeShip('Carrier', [3, 3], 'ver');
// gameboard.placeShip('Battleship', [0, 5], 'hor');
// gameboard.placeShip('Destroyer', [6, 6], 'ver');
// gameboard.placeShip('Submarine', [5, 1], 'ver');
// gameboard.placeShip('Patrol Boat', [7, 8], 'ver');

// console.log(gameboard.checkAllShipsSunk());

// // gameboard.receiveAttack([3, 2]);

// gameboard.gameboard.forEach((element) => {
//   console.log(element);
// });

export default Gameboard;
