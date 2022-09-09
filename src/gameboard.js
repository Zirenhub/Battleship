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
    console.log(xCoor);
    console.log(yCoor);

    while (shipLength > 0) {
      this.gameboard[(xCoor += 1)][yCoor] = newShip.getShipName();
      shipLength--;
    }
  }
}

const gameboard = new Gameboard();
gameboard.placeShip('Destroyer', [4, 5], 'vertical');

console.log(gameboard);
console.log(
  gameboard.gameboard.forEach((element) => {
    console.log(element);
  })
);

export default Gameboard;
