import Gameboard from './gameboard.js';

class Player {
  constructor(name) {
    this.playerBoard = new Gameboard();
    this.opponent = null;
    this.name = name;
  }

  getTurn() {
    return this.opponent.getPlayerName();
  }

  attacks([x, y]) {
    this.opponent.playerBoard.receiveAttack([x, y]);
  }

  getPlayerName() {
    return this.name;
  }

  AIAttacks() {
    const randomNum = () => {
      return Math.floor(Math.random() * 10);
    };

    const attackCoor = [randomNum(), randomNum()];
    this.attacks(attackCoor);
    console.log(attackCoor);
  }
}

const PlayerOne = new Player('Human');
const PlayerAI = new Player('AI');
PlayerOne.opponent = PlayerAI;
PlayerAI.opponent = PlayerOne;

console.log(PlayerOne.playerBoard);
console.log('^----- player one board -----^');
PlayerOne.playerBoard.placeShip('Carrier', [2, 2], 'hor');

PlayerOne.playerBoard.gameboard.forEach((element) => {
  console.log(element);
});
console.log('^----- player one board game -----^');

console.log(PlayerAI.playerBoard);
console.log('^----- player ai board -----^');
PlayerAI.playerBoard.placeShip('Submarine', [4, 1], 'ver');

PlayerAI.playerBoard.gameboard.forEach((element) => {
  console.log(element);
});
console.log('^----- player ai board game -----^');

// player one attacks player ai
PlayerOne.attacks([4, 1]);

PlayerAI.playerBoard.gameboard.forEach((element) => {
  console.log(element);
});
console.log('^----- player ai board game -----^');

// player ai attacks player one
PlayerAI.AIAttacks();

PlayerOne.playerBoard.gameboard.forEach((element) => {
  console.log(element);
});
console.log('^----- player one board game -----^');

export default Player;
