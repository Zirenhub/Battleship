const playerOneContainer = document.querySelector('.player-one-container');
const playerTwoContainer = document.querySelector('.player-two-container');

const getPlayerContainer = (thisPlayer) => {
  let currentPlayerContainer;
  if (thisPlayer.getName() === 'Human') {
    currentPlayerContainer = playerOneContainer;
  } else if (thisPlayer.getName() === 'Computer') {
    currentPlayerContainer = playerTwoContainer;
  }
  return currentPlayerContainer;
};

const createPlayerGrid = (player) => {
  const thisPlayer = player;
  const arrayGrid = thisPlayer.playerBoard.gameboard;
  const playerContainer = getPlayerContainer(thisPlayer);

  arrayGrid.forEach((row) => {
    row.forEach((cell) => {
      const displayCell = document.createElement('div');
      displayCell.classList.add('cell');
      displayCell.dataset.coor = cell;
      displayCell.addEventListener('click', () => {
        // console.log(cell);
        console.log(displayCell.dataset);
      });
      playerContainer.appendChild(displayCell);
    });
  });
  playerContainer.style.gridTemplateColumns = `repeat(${arrayGrid.length}, auto)`;
  playerContainer.style.gridTemplateRows = `repeat(${arrayGrid.length}, auto)`;
};

const playerPlaceShip = (player, shipClass, [x, y], dir) => {
  const thisPlayer = player;
  const playerGameboard = player.playerBoard;
  let shipPlaced = shipClass;
  const pos0 = x;
  const pos1 = y;
  const direction = dir;

  const playerContainer = getPlayerContainer(thisPlayer); // get player's container in the dom

  if (
    playerGameboard.placeShip(shipPlaced, [pos0, pos1], direction) === false
  ) {
    return;
  } // place the ship in players gameboard // if false is returned then exit, something went wrong

  const ship = playerGameboard.getShip(shipPlaced); // store the ship
  const shipPositions = ship.length; // get the length of the ship // length is also array of the positions as in [3, 5] etc.

  if (shipPlaced === 'Patrol Boat') {
    shipPlaced = 'patrolBoat';
  } // to be fixed latter ^
  shipPositions.forEach((pos) => {
    let xPos = pos[0];
    let yPos = pos[1] + 1; // we add + 1 since grid div's children start from 1 unlike js array's that start from 0
    if (yPos >= 10) {
      xPos += 1;
      yPos = 0;
    } // if after adding +1 to yPos the value become 10 or greater than 10 then add +1 to xPos and make yPos 0
    //   for DOM purposes expample: bellow at displayGridPos [4, 9] becomes 50 so we target 50th div of the grid
    const displayGridPos = Number(`${xPos}${yPos}`); // joint the positions together [3, 5] becomes 36
    const playerGridPos = playerContainer.childNodes[displayGridPos]; // get the 36th grid div cell
    playerGridPos.dataset.coor = shipPlaced; // replace its dataset with the name of ship being placed
    playerGridPos.setAttribute('id', `${shipPlaced}`); // give the div's id with the name of the ship being placed
  });
  // most likely not the best way of doing this, but the only solution i can think of 😕
};

export { createPlayerGrid, playerPlaceShip };
