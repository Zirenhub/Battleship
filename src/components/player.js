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
    if (this.checkAlreadyShot([x, y])) {
      return false;
    } // if the [x, y] position is already shot at return with false
    this.allShots.push([x, y]);
    if (this.opponent.playerBoard.receiveAttack([x, y])) {
      return true;
    } // if shot was a hit return true
    return false;
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
    this.playerBoard.placeShip(
      'Carrier',
      [this.randomNum(), this.randomNum()],
      this.randomDir()
    );
    this.playerBoard.placeShip(
      'Battleship',
      [this.randomNum(), this.randomNum()],
      this.randomDir()
    );
    this.playerBoard.placeShip(
      'Destroyer',
      [this.randomNum(), this.randomNum()],
      this.randomDir()
    );
    this.playerBoard.placeShip(
      'Submarine',
      [this.randomNum(), this.randomNum()],
      this.randomDir()
    );
    this.playerBoard.placeShip(
      'Patrol Boat',
      [this.randomNum(), this.randomNum()],
      this.randomDir()
    );

    if (this.playerBoard.ships.length < 5) {
      this.AIPlaceShips();
    } // brute force way of doing things, maybe check if ship exists and only if it doesn't then try that ship with rano coords ?
  }

  AIAttacks() {
    const attackCoor = [this.randomNum(), this.randomNum()];
    if (this.checkAlreadyShot([attackCoor[0], attackCoor[1]])) {
      this.AIAttacks();
    }

    this.attacks(attackCoor);

    // return the rando coordinates ?
    console.log(attackCoor);
  }
}

export default Player;
