const playerOneContainer = document.querySelector('.player-one-container');
const playerTwoContainer = document.querySelector('.player-two-container');
const contentParent = document.querySelector('.main-container');

const getPlayerContainer = (thisPlayer) => {
  let currentPlayerContainer;
  if (thisPlayer.getName() !== 'Computer') {
    currentPlayerContainer = playerOneContainer;
  } else if (thisPlayer.getName() === 'Computer') {
    currentPlayerContainer = playerTwoContainer;
  }
  return currentPlayerContainer;
};

const declareWinner = (player) => {
  let winnerCongratsText = document.createElement('div');
  winnerCongratsText.setAttribute('id', 'winnerCongrats');
  winnerCongratsText.textContent = `Congrats ${player.getName()} won the game!`;
  contentParent.appendChild(winnerCongratsText);
};

const AIAttacksDOM = (thisPlayer) => {
  console.log(thisPlayer);
  const AIAttackCoords = thisPlayer.AIAttacks();
  const dataID = `${AIAttackCoords[0]} ${AIAttackCoords[1]}`;
  const cell = playerOneContainer.querySelector(`[data-coor='${dataID}']`);
  cell.classList.remove('cell');
  // only the human's ships have id to visualize them in the board with different colors
  if (cell.hasAttribute('id')) {
    cell.classList.add('hit');
  } else {
    cell.classList.add('missed');
  }
};

const recieveAttack = (displayCell, arrayFormat, thisPlayer) => {
  displayCell.classList.remove('cell');
  const playerOneAttacks = thisPlayer.opponent.attacks(arrayFormat);
  // when we click on playerTwo's board playerTwo's opponent attacks.
  if (playerOneAttacks === undefined) {
    return false;
  } // undefined is returned when the position is already shot

  if (playerOneAttacks) {
    displayCell.classList.add('hit');
  } else {
    displayCell.classList.add('missed');
  }
  return true;

  // now it's AI's turn to attack
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
            if (
              thisPlayer.winner === true ||
              thisPlayer.opponent.winner === true
            ) {
              return;
            }
            if (recieveAttack(displayCell, arrayFormat, thisPlayer) !== false) {
              AIAttacksDOM(thisPlayer);
              // ^ false will only be returned if playerOne attack is undefined which means pos is already shot,
              // in which case AI doesn't attack and we wait for player to click on a tile that hasn't been shot
            }
            if (thisPlayer.winner === true) {
              declareWinner(thisPlayer);
            }
            if (thisPlayer.opponent.winner === true) {
              declareWinner(thisPlayer.opponent);
            }
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
    }); // this is the playerOneContainer
  }

  playerContainer.style.gridTemplateColumns = `repeat(${arrayGrid.length}, auto)`;
  playerContainer.style.gridTemplateRows = `repeat(${arrayGrid.length}, auto)`;
};

const addHoverEffect = (length, placeCell, direction) => {
  const shipLength = length;

  const dataID = placeCell.dataset.coor;
  if (dataID === undefined) {
    return;
  }

  let xPos = Number(dataID[0]);
  let yPos = Number(dataID[2]); // dataID[1] is empty space

  let selectedCell = playerOneContainer.querySelector(
    `[data-coor='${xPos} ${yPos}']`
  );

  for (let i = 0; i < shipLength; i++) {
    if (direction === 'ver') {
      selectedCell = playerOneContainer.querySelector(
        `[data-coor='${xPos++} ${yPos}']`
      );
    } else if (direction === 'hor') {
      selectedCell = playerOneContainer.querySelector(
        `[data-coor='${xPos} ${yPos++}']`
      );
    }

    if (selectedCell === null) {
      return;
    }

    selectedCell.classList.add('placing');
  }
};

const playerMoveShip = (shipLength, shipPlaced, player) => {
  if (player.allShots.length) {
    return;
  } // if game started // first shot was fired, then exit, player is not allowed to move ships

  let direction = 'ver';

  const changeHoverDirection = (e) => {
    if (e.key === 'r') {
      direction === 'ver' ? (direction = 'hor') : (direction = 'ver');
    }
  };

  const _placeListener = (placeCell) => {
    const target = placeCell.target;
    const ship = shipPlaced;
    if (newShipPos(target, ship, player, direction)) {
      playerOneContainer.removeEventListeners();
      document.removeEventListener('keydown', changeHoverDirection);
    }
  };

  const _hoverListener = (e) => {
    const placeCell = e.target;
    const length = shipLength;
    addHoverEffect(length, placeCell, direction);

    placeCell.addEventListener('click', _placeListener);
  };

  const removeHoverEffect = () => {
    const cells = playerOneContainer.querySelectorAll('.cell');
    cells.forEach((cell) => {
      cell.classList.remove('placing');
      cell.removeEventListener('click', _placeListener);
    });
  };

  if (playerOneContainer.removeEventListeners) {
    playerOneContainer.removeEventListeners();
  }

  playerOneContainer.addEventListener('mouseover', _hoverListener);
  document.addEventListener('keydown', changeHoverDirection);

  playerOneContainer.removeEventListeners = () => {
    playerOneContainer.removeEventListener('mouseover', _hoverListener);
    removeHoverEffect();
  };

  // remove the hover effect on cells after mouseout
  playerOneContainer.addEventListener('mouseout', removeHoverEffect);
};

const removeOldShipPos = (oldShipPosArray) => {
  const positionsToRemove = oldShipPosArray;
  positionsToRemove.forEach((pos) => {
    const cell = document.querySelector(`[data-coor='${pos[0]} ${pos[1]}']`);
    cell.removeAttribute('id');
    const clone = cell.cloneNode(false);
    cell.parentNode.replaceChild(clone, cell);
  });
  // cleaning old positions of the relocated ship, removing its id and replacing it with a node clone,
  // to remove its eventListeners.
};

const newShipPos = (target, ship, player, direction) => {
  const targetCell = target.dataset.coor;
  const targetShip = ship.getShipClass();
  const pos = [Number(targetCell[0]), Number(targetCell[2])];

  const oldShipPosArray = [];

  const getShip = player.playerBoard.getShip(targetShip); // store the old ship
  const oldShipPositions = getShip.length;
  oldShipPositions.forEach((pos) => {
    oldShipPosArray.push(pos);
  });

  let newShipPos;

  if (direction === 'ver') {
    newShipPos = player.playerBoard.placeShip(targetShip, pos, 'ver');
  } else if (direction === 'hor') {
    newShipPos = player.playerBoard.placeShip(targetShip, pos, 'hor');
  }

  if (newShipPos !== false) {
    removeOldShipPos(oldShipPosArray);
    placeShips(player, getShip);

    return true;
  }
  return false;
};

const placeShips = (player, ship) => {
  const shipPlaced = ship;
  const playerContainer = getPlayerContainer(player);
  let shipName = ship.shipClass;
  const shipPositions = shipPlaced.length; // get the length of the ship // length is also array of the positions as in [3, 5] etc.
  const shipLength = shipPlaced.length.length;

  shipPositions.forEach((pos) => {
    const xPos = pos[0]; // store the first coordinate exp: [3, 5] store 3
    const yPos = pos[1]; // store the second coordinate
    const dataID = `${xPos} ${yPos}`; // store both of the coordinates into a string exp: 3 5

    const child = playerContainer.querySelector(`[data-coor='${dataID}']`); // ^ store the child div of the playerContainer with the current dataID
    child.setAttribute('id', `${shipName}`); // set the div's id with the name of the ship being placed
    child.addEventListener('click', () =>
      playerMoveShip(shipLength, shipPlaced, player)
    );
  });
  // most likely not the best way of doing this, but the only solution i can think of 😕
};

export { createPlayerGrid, placeShips };
