import './css/style.css';
import './index.html';
import Player from './components/player.js';
import {
  createPlayerGrid,
  playerPlaceShip,
  AIUpdateDisplay,
  recieveAttack,
} from './components/dom-manipulation.js';

const NewPlayer = Player;

const gameStart = () => {
  const playerOne = new NewPlayer('Human');
  const playerAI = new NewPlayer('Computer');
  playerOne.opponent = playerAI;
  playerAI.opponent = playerOne;

  createPlayerGrid(playerOne);
  createPlayerGrid(playerAI);

  playerPlaceShip(playerOne, 'Carrier', [0, 0], 'hor');
  playerPlaceShip(playerOne, 'Battleship', [1, 7], 'ver');
  playerPlaceShip(playerOne, 'Destroyer', [5, 4], 'ver');
  playerPlaceShip(playerOne, 'Submarine', [3, 1], 'ver');
  playerPlaceShip(playerOne, 'Patrol Boat', [4, 9], 'ver');

  playerAI.AIPlaceShips();
  AIUpdateDisplay(playerAI);
};

const gameLoop = () => {};

gameStart();
