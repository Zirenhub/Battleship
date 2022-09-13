import './css/style.css';
import './index.html';
import Player from './player.js';
import { createPlayerGrid, playerPlaceShip } from './dom-manipulation.js';

const NewPlayer = Player;

const playerOne = new NewPlayer('Human');
const playerAI = new NewPlayer('Computer');

createPlayerGrid(playerOne);
createPlayerGrid(playerAI);

playerPlaceShip(playerOne, 'Carrier', [0, 0], 'hor');
playerPlaceShip(playerOne, 'Battleship', [1, 7], 'ver');
playerPlaceShip(playerOne, 'Destroyer', [5, 4], 'ver');
playerPlaceShip(playerOne, 'Submarine', [3, 1], 'ver');
playerPlaceShip(playerOne, 'Patrol Boat', [4, 9], 'ver');

playerPlaceShip(playerAI, 'Carrier', [3, 1], 'ver');
playerPlaceShip(playerAI, 'Battleship', [9, 2], 'hor');
playerPlaceShip(playerAI, 'Destroyer', [4, 4], 'hor');
playerPlaceShip(playerAI, 'Submarine', [7, 7], 'hor');
playerPlaceShip(playerAI, 'Patrol Boat', [0, 2], 'hor');
