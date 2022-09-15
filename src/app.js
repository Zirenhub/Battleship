import './css/style.css';
import './index.html';
import Player from './components/player.js';
import { createPlayerGrid, placeShips } from './components/dom-manipulation.js';

const NewPlayer = Player;

const playerOne = new NewPlayer('Human');
const playerAI = new NewPlayer('Computer');
playerOne.opponent = playerAI;
playerAI.opponent = playerOne;

const gameStart = {
  init() {
    createPlayerGrid(playerOne);
    createPlayerGrid(playerAI);

    playerAI.AIPlaceShips();
    this.AIUpdateDisplay(playerAI);
  },

  playerPlaceShip(player, shipClass, [x, y], dir) {
    const playerGameboard = player.playerBoard;
    const shipPlaced = shipClass;
    const pos0 = x;
    const pos1 = y;
    const direction = dir;

    if (
      playerGameboard.placeShip(shipPlaced, [pos0, pos1], direction) === false
    ) {
      return;
    } // place the ship in players gameboard // if false is returned then exit, something went wrong

    const ship = playerGameboard.getShip(shipPlaced); // store the ship
    placeShips(playerOne, ship);
  },

  AIUpdateDisplay(playerAI) {
    const AIShips = playerAI.playerBoard.ships;

    AIShips.forEach((ship) => {
      placeShips(playerAI, ship);
    });
  },
};

// const gameLoop = () => {};

gameStart.init();

gameStart.playerPlaceShip(playerOne, 'Carrier', [0, 0], 'hor');
gameStart.playerPlaceShip(playerOne, 'Battleship', [1, 7], 'ver');
gameStart.playerPlaceShip(playerOne, 'Destroyer', [5, 4], 'ver');
gameStart.playerPlaceShip(playerOne, 'Submarine', [3, 1], 'ver');
gameStart.playerPlaceShip(playerOne, 'Patrol Boat', [4, 9], 'ver');
