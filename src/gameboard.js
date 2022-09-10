import Ship from './ship.js';

class Gameboard {
  constructor() {
    this.gameboard = this.constructor.createGameboard();
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
    const newShip = new Ship(s);
    const direction = dir;
    let xCoor = x;
    let yCoor = y;
    let shipLength = newShip.getLength();

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
  }
}

// const gameboard = new Gameboard();
// gameboard.placeShip('Submarine', [5, 5], 'ver');

// gameboard.gameboard.forEach((element) => {
//   console.log(element);
// });

export default Gameboard;
