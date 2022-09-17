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

// const hoverEffect = (e, shipLength, mouseState) => {
//   const dataID = e.target.dataset.coor;
//   if (dataID === undefined) {
//     return;
//   }

//   const length = shipLength;
//   let xPos = Number(dataID[0]);
//   let yPos = Number(dataID[2]); // dataID[1] is empty space

//   let selectedCell = playerOneContainer.querySelector(
//     `[data-coor='${xPos} ${yPos}']`
//   );

//   for (let i = 0; i < length; i++) {
//     selectedCell = playerOneContainer.querySelector(
//       `[data-coor='${xPos++} ${yPos}']`
//     );

//     if (selectedCell === null) {
//       return;
//     }

//     if (mouseState === 'mouseover') {
//       selectedCell.classList.add('placing');
//     } else {
//       selectedCell.classList.remove('placing');
//     }
//   }
// };

const playerMoveShip = (shipSelected, player) => {
  // const ship = shipSelected;
  // const shipLength = ship.length.length;
  // playerOneContainer.addEventListener('mouseover', function _listener(e) {
  //   hoverEffect(e, shipLength, 'mouseover');
  //   let placeCell = playerOneContainer.querySelector('.cell.placing');
  //   if (placeCell === null) {
  //     return;
  //   }
  //   placeCell.addEventListener('click', function _placeShipListener(e) {
  //     if (newShipPos(e, ship, player)) {
  //       playerOneContainer.removeEventListener('mouseover', _listener);
  //       placeCell.removeEventListener('click', _placeShipListener);
  //     } // if we placed the ship in it's new location successfully, then remove the eventListeners
  //   });
  // });
  // playerOneContainer.addEventListener('mouseout', function _listenerOut(e) {
  //   hoverEffect(e, shipLength, 'mouseout');
  // });
};

const removeOldShipPos = (oldShipPosArray) => {
  const positionsToRemove = oldShipPosArray;
  positionsToRemove.forEach((pos) => {
    const cell = document.querySelector(`[data-coor='${pos[0]} ${pos[1]}']`);
    cell.removeAttribute('id');
    // const clone = cell.cloneNode(false);
    // cell.parentNode.replaceChild(clone, cell);
  });
};

const newShipPos = (e, ship, player) => {
  const targetCell = e.target.dataset.coor;
  const targetShip = ship.getShipClass();
  const pos = [Number(targetCell[0]), Number(targetCell[2])];

  const oldShipPosArray = [];

  const getShip = player.playerBoard.getShip(targetShip); // store the old ship
  const oldShipPositions = getShip.length;
  oldShipPositions.forEach((pos) => {
    oldShipPosArray.push(pos);
  });

  const newShipPos = player.playerBoard.placeShip(targetShip, pos, 'ver');

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

  if (shipName === 'Patrol Boat') {
    shipName = 'patrolBoat';
  } // to be fixed latter ^
  shipPositions.forEach((pos) => {
    const xPos = pos[0]; // store the first coordinate exp: [3, 5] store 3
    const yPos = pos[1]; // store the second coordinate
    const dataID = `${xPos} ${yPos}`; // store both of the coordinates into a string exp: 3 5

    const child = playerContainer.querySelector(`[data-coor='${dataID}']`); // ^ store the child div of the playerContainer with the current dataID
    child.setAttribute('id', `${shipName}`); // set the div's id with the name of the ship being placed
    child.addEventListener('click', () => {
      shipName === 'patrolBoat' ? (shipName = 'Patrol Boat') : shipName;
      const shipSelected = player.playerBoard.getShip(shipName);
      playerMoveShip(shipSelected, player);
    });
  });
  // most likely not the best way of doing this, but the only solution i can think of 😕
};

export { createPlayerGrid, placeShips };