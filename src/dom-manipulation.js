const playerOneContainer = document.querySelector('.player-one-container');
const playerTwoContainer = document.querySelector('.player-two-container');

const createPlayerGrid = (player) => {
  const thisPlayer = player;
  let currentPlayer;
  if (player.getName() === 'Human') {
    currentPlayer = playerOneContainer;
  } else if (player.getName() === 'Computer') {
    currentPlayer = playerTwoContainer;
  }
  const arrayGrid = thisPlayer.playerBoard.gameboard;
  console.log(arrayGrid);

  arrayGrid.forEach((row) => {
    row.forEach((cell) => {
      const displayCell = document.createElement('div');
      displayCell.classList.add('cell');
      displayCell.dataset.coor = cell;
      displayCell.addEventListener('click', () => {
        console.log(cell);
        // console.log(displayCell.dataset);
      });
      currentPlayer.appendChild(displayCell);
    });
  });
  currentPlayer.style.gridTemplateColumns = `repeat(${arrayGrid.length}, auto)`;
  currentPlayer.style.gridTemplateRows = `repeat(${arrayGrid.length}, auto)`;
};

const playerPlaceShip = (player, shipClass, [x, y], dir) => {
  const playerGameboard = player.playerBoard;
  const shipPlaced = shipClass;
  const pos0 = x;
  const pos1 = y;
  const direction = dir;

  playerGameboard.placeShip(shipPlaced, [pos0, pos1], direction);
  console.log(playerGameboard);
};

export { createPlayerGrid, playerPlaceShip };
