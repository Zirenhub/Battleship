import Gameboard from './gameboard.js';

class Player {
  constructor() {
    this.playerBoard = new Gameboard();
    this.opponent = null;
    this.allShots = [];
  }

  // getTurn() {
  //   return this.opponent;
  // }

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

  AIAttacks() {
    const randomNum = () => {
      return Math.floor(Math.random() * 10);
    };

    const attackCoor = [randomNum(), randomNum()];
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
