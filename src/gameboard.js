import Ship from './ship.js';

class Gameboard {
  constructor() {
    this.gameboard = this.constructor.createGameboard();
    this.ships = [];
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
    let xCoor = x;
    let yCoor = y;

    const direction = dir;
    if (direction !== 'ver' && direction !== 'hor') {
      return console.log('invalid direction only "ver" or "hor"');
    }

    const newShip = new Ship(s);
    let shipLength = newShip.getLength();

    if (direction === 'ver') {
      if (yCoor < 0 || yCoor > 9) {
        return console.log('invalid Y coordinates');
      }
      if (xCoor - 1 + shipLength > 9 || xCoor < 0) {
        return console.log('invalid X coordinates');
      }
    } else if (direction === 'hor') {
      if (yCoor - 1 + shipLength > 9 || yCoor < 0) {
        return console.log('invalid Y coordinates');
      }
      if (xCoor < 0 || xCoor > 9) {
        return console.log('invalid X coordinates');
      }
    }

    if (this.checkProximity([x, y], shipLength, direction)) {
      return console.log(
        'occupied by ship nearby (sides or top/bottom and edges)'
      );
    }

    while (shipLength > 0) {
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
      const ship = this.ships.findIndex(findShip);
      console.log(this.ships[ship]);
    } else {
      console.log('hit missed');
    }
  }
}

const gameboard = new Gameboard();
gameboard.placeShip('Carrier', [3, 2], 'ver');
gameboard.placeShip('Submarine', [6, 6], 'hor');

gameboard.receiveAttack([6, 6]);

gameboard.gameboard.forEach((element) => {
  console.log(element);
});

export default Gameboard;
