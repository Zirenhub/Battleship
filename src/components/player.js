import Gameboard from './gameboard.js';

class Player {
  constructor(name) {
    this.playerBoard = new Gameboard();
    this.opponent = null;
    this.allShots = [];
    this.name = name;
    this.winner = false;
  }

  // getTurn() {
  //   return this.opponent;
  // }

  getName() {
    return this.name;
  }

  attacks([x, y]) {
    if (this.checkAlreadyShot([x, y])) {
      return;
      // if the [x, y] position is already shot at return // exit
    } else {
      this.allShots.push([x, y]);
      const attackOpponent = this.opponent.playerBoard.receiveAttack([x, y]); // returns true if shot hit, false if it didn't
      const isAllOpponentShipsSunk =
        this.opponent.playerBoard.checkAllShipsSunk(); // returns true if all ships are sunk, false otherwise

      if (isAllOpponentShipsSunk) this.winner = true;
      return attackOpponent;
    }
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
    const placeCarrier = () => {
      this.playerBoard.placeShip(
        'Carrier',
        [this.randomNum(), this.randomNum()],
        this.randomDir()
      );
    };

    const placeBattleship = () => {
      this.playerBoard.placeShip(
        'Battleship',
        [this.randomNum(), this.randomNum()],
        this.randomDir()
      );
    };

    const placeDestroyer = () => {
      this.playerBoard.placeShip(
        'Destroyer',
        [this.randomNum(), this.randomNum()],
        this.randomDir()
      );
    };

    const placeSubmarine = () => {
      this.playerBoard.placeShip(
        'Submarine',
        [this.randomNum(), this.randomNum()],
        this.randomDir()
      );
    };

    const placePatrolBoat = () => {
      this.playerBoard.placeShip(
        'PatrolBoat',
        [this.randomNum(), this.randomNum()],
        this.randomDir()
      );
    };

    const allShips = this.playerBoard.ships;
    const shipsToAdd = [
      'Carrier',
      'Battleship',
      'Destroyer',
      'Submarine',
      'PatrolBoat',
    ];

    while (allShips.length !== 5) {
      allShips.forEach((ship) => {
        const shipName = ship.getShipClass();
        if (shipsToAdd.includes(shipName)) {
          shipsToAdd.splice(shipsToAdd.indexOf(shipName), 1); // remove the ship
        }
      });
      shipsToAdd.forEach((ship) => {
        if (ship === 'Carrier') {
          placeCarrier();
        } else if (ship === 'Battleship') {
          placeBattleship();
        } else if (ship === 'Destroyer') {
          placeDestroyer();
        } else if (ship === 'Submarine') {
          placeSubmarine();
        } else if (ship === 'PatrolBoat') {
          placePatrolBoat();
        }
      });
    }
  }

  AIAttacks() {
    const attackCoor = [this.randomNum(), this.randomNum()];
    if (this.checkAlreadyShot([attackCoor[0], attackCoor[1]])) {
      console.log('AI is gonna retry hitting');
      return this.AIAttacks(); // do AIAttacks until AI hits with available position
    } else {
      this.attacks(attackCoor);
      return attackCoor;
    }
  }
}

export default Player;
