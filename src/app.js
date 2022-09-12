import './css/style.css';
import './index.html';
import Player from './player.js';
import { createPlayerGrid, playerPlaceShip } from './dom-manipulation.js';

const NewPlayer = Player;

const playerOne = new NewPlayer('Human');
const playerAI = new NewPlayer('Computer');

// const playerOneGameboard = playerOne.playerBoard;
// const playerAIGameboard = playerAI.playerBoard;

createPlayerGrid(playerOne);
createPlayerGrid(playerAI);

playerPlaceShip(playerOne, 'Battleship', [3, 5], 'ver');
