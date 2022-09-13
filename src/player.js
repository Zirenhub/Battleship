import Gameboard from './gameboard.js';

class Player {
  constructor(name) {
    this.playerBoard = new Gameboard();
    this.opponent = null;
    this.allShots = [];
    this.name = name;
  }

  // getTurn() {
  //   return this.opponent;
  // }

  getName() {
    return this.name;
  }

  attacks([x, y]) {
    this.opponent.playerBoard.receiveAttack([x, y]);
    this.allShots.push([x, y]);
  }

  checkAlreadyShot([x, y]) {
    const checkAlreadyShot = this.allShots.some((shot) => {
      if (shot[0] === x && shot[1] === y) {
        return true;
      }
      return false;
    });

    if (checkAlreadyShot === true) {
      return true;
    }
    return false;
  }

  randomNum() {
    return Math.floor(Math.random() * 10);
  }

  AIPlaceShips() {
    this.playerBoard.placeShip(
      'Carrier',
      [this.randomNum(), this.randomNum()],
      'ver'
    );
    this.playerBoard.placeShip(
      'Battleship',
      [this.randomNum(), this.randomNum()],
      'hor'
    );
    this.playerBoard.placeShip(
      'Destroyer',
      [this.randomNum(), this.randomNum()],
      'hor'
    );
    this.playerBoard.placeShip(
      'Submarine',
      [this.randomNum(), this.randomNum()],
      'hor'
    );
    this.playerBoard.placeShip(
      'Patrol Boat',
      [this.randomNum(), this.randomNum()],
      'ver'
    );

    if (this.playerBoard.ships.length < 5) {
      this.AIPlaceShips();
    } // brute force way of doing things, maybe check if ship exists and only if it doesn't then try that ship with rano coords ?
  }

  AIAttacks() {
    const attackCoor = [this.randomNum(), this.randomNum()];
    if (this.checkAlreadyShot([attackCoor[0], attackCoor[1]])) {
      console.log('position is already shot at, retrying');
      this.AIAttacks();
    }

    this.attacks(attackCoor);

    // return the rando coordinates ?
    console.log(attackCoor);
  }
}

export default Player;
