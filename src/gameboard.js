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

    // this.checkProximity([x, y], shipLength, direction);

    while (shipLength > 0) {
      if (direction === 'ver') {
        // if (this.gameboard[xCoor][yCoor] !== null) {
        //   break;
        // }
        // console.log('space is occupied');
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
    const shipPos = [];
    const verMoves = [
      { x: xCoor - 1, y: yCoor },
      { x: xCoor - 1, y: yCoor - 1 },
      { x: xCoor - 1, y: yCoor + 1 },
    ]; // ^ standard positions for top part of the ship.

    while (length > 0) {
      if (direction === 'ver') {
        // console.log(this.gameboard[xCoor][yCoor]);
        shipPos.push([xCoor, yCoor]);
        verMoves.push({ x: xCoor, y: yCoor - 1 }, { x: xCoor, y: yCoor + 1 }); // positions for sides of the ship
        xCoor += 1;
        if (length === 1) {
          verMoves.push(
            { x: xCoor, y: yCoor },
            { x: xCoor, y: yCoor - 1 },
            { x: xCoor, y: yCoor + 1 }
          ); // ^ positions for the bottom part of the ship.
        }
      } else if (direction === 'hor') {
        console.log(this.gameboard[xCoor][yCoor]);
        yCoor += 1;
      }

      length -= 1;
    }

    verMoves.forEach((m) => {
      let { checkX } = m;
      checkX = m.x;
      let { checkY } = m;
      checkY = m.y;

      console.log(`${this.gameboard[checkX][checkY]} ${checkX} / ${checkY}`);
    });

    // shipPos.forEach((pos) => {
    //   console.log(pos);
    // });
    // verMoves.forEach((pos) => {
    //   console.log(pos);
    // });
  }

  // receiveAttack([x, y]) {
  //   const xCoor = x;
  //   const yCoor = y;

  //   if (this.gameboard[xCoor][yCoor] !== null) {
  //     const ships = this.ships;
  //     console.log(ships);
  //   }
  // }
}

const gameboard = new Gameboard();
gameboard.placeShip('Submarine', [2, 2], 'ver');
gameboard.placeShip('Patrol Boat', [2, 1], 'ver');
gameboard.checkProximity([2, 2], 3, 'ver');
// gameboard.receiveAttack([2, 2]);

gameboard.gameboard.forEach((element) => {
  console.log(element);
});

export default Gameboard;
