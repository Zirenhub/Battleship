import Ship from './ship';

class Gameboard {
  constructor(s, x, y) {
    this.gameboard = this.constructor.createGameboard();
    this.place = this.placeShip(s, x, y);
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

  placeShip(s, x, y) {
    const newShip = new Ship(s);
    this.ships.push(newShip.shipClass);
  }
}

export default Gameboard;
