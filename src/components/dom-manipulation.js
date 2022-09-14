const playerOneContainer = document.querySelector('.player-one-container');
const playerTwoContainer = document.querySelector('.player-two-container');

const getPlayerContainer = (thisPlayer) => {
  let currentPlayerContainer;
  if (thisPlayer.getName() !== 'Computer') {
    currentPlayerContainer = playerOneContainer;
  } else if (thisPlayer.getName() === 'Computer') {
    currentPlayerContainer = playerTwoContainer;
  }
  return currentPlayerContainer;
};

const recieveAttack = (displayCell, arrayFormat, thisPlayer) => {
  displayCell.classList.remove('cell');
  if (thisPlayer.opponent.attacks(arrayFormat)) {
    displayCell.classList.add('hit');
  } // example: thisPlayer = playerTwo, when we click on playerTwo's board playerTwo's opponent attacks.
  displayCell.classList.add('missed');

  // after AI takes the attack it's AI's turn to attack
};

const createPlayerGrid = (player) => {
  const thisPlayer = player;
  const arrayGrid = thisPlayer.playerBoard.gameboard;
  const playerContainer = getPlayerContainer(thisPlayer);

  if (playerContainer === playerTwoContainer) {
    arrayGrid.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const displayCell = document.createElement('div');
        displayCell.classList.add('cell');
        displayCell.dataset.coor = `${rowIndex} ${cellIndex}`;
        const arrayFormat = [rowIndex, cellIndex];
        displayCell.addEventListener(
          'click',
          () => {
            recieveAttack(displayCell, arrayFormat, thisPlayer);
          },
          false
        );
        playerContainer.appendChild(displayCell);
      });
    }); // adding eventlistener for playerTwoContainer since this is the container that the human player will be attacking
  } else {
    arrayGrid.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const displayCell = document.createElement('div');
        displayCell.classList.add('cell');
        displayCell.dataset.coor = `${rowIndex} ${cellIndex}`;
        playerContainer.appendChild(displayCell);
      });
    }); // this is the playerOneContainer and no eventlistener since AI doesn't need to click
  }

  playerContainer.style.gridTemplateColumns = `repeat(${arrayGrid.length}, auto)`;
  playerContainer.style.gridTemplateRows = `repeat(${arrayGrid.length}, auto)`;
};

const placeShips = (player, ship) => {
  const shipPlaced = ship;
  const playerContainer = getPlayerContainer(player);
  let shipName = ship.shipClass;
  const shipPositions = shipPlaced.length; // get the length of the ship // length is also array of the positions as in [3, 5] etc.

  if (shipName === 'Patrol Boat') {
    shipName = 'patrolBoat';
  } // to be fixed latter ^
  shipPositions.forEach((pos) => {
    const xPos = pos[0]; // store the first coordinate exp: [3, 5] store 3
    const yPos = pos[1]; // store the second coordinate
    const dataID = `${xPos} ${yPos}`; // store both of the coordinates into a string exp: 3 5

    const child = playerContainer.querySelector(`[data-coor='${dataID}']`); // ^ store the child div of the playerContainer with the current dataID
    child.setAttribute('id', `${shipName}`); // set the div's id with the name of the ship being placed
  });
  // most likely not the best way of doing this, but the only solution i can think of 😕
};

export { createPlayerGrid, placeShips };
