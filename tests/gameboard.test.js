import Gameboard from '../src/gameboard';

const emptyBoard = [
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
];

describe('create gameboard', () => {
  const gameboard = new Gameboard();

  test('creates gameboard', () => {
    expect(gameboard.gameboard).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });
});

let gameboard;

describe('placing ships', () => {
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('place "Destroyer" at [0,0] in vertical pos', () => {
    gameboard.placeShip('Destroyer', [0, 0], 'ver');
    expect(gameboard.gameboard).toEqual([
      ['Des', null, null, null, null, null, null, null, null, null],
      ['Des', null, null, null, null, null, null, null, null, null],
      ['Des', null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });

  test('place "Submarine" at [5, 5] in horizontal pos', () => {
    gameboard.placeShip('Submarine', [5, 5], 'hor');
    expect(gameboard.gameboard).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, 'Sub', 'Sub', 'Sub', null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });

  test('place "Carrier" at [2, 2] in vertical pos', () => {
    gameboard.placeShip('Carrier', [2, 2], 'ver');
    expect(gameboard.gameboard).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, 'Car', null, null, null, null, null, null, null],
      [null, null, 'Car', null, null, null, null, null, null, null],
      [null, null, 'Car', null, null, null, null, null, null, null],
      [null, null, 'Car', null, null, null, null, null, null, null],
      [null, null, 'Car', null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });
});

let logSpy;

describe('placing ships at invalid pos', () => {
  beforeEach(() => {
    gameboard = new Gameboard();
    logSpy = jest.spyOn(console, 'log');
  });

  test('place "Carrier" at pos [6, 0] in ver dir (out of borders)', () => {
    gameboard.placeShip('Carrier', [6, 0], 'ver');
    expect(logSpy).toHaveBeenCalledWith('invalid X coordinates');
    expect(gameboard.gameboard).toEqual(emptyBoard);
  });

  test('place "Carrier" at invalid pos [6, 6] in hor dir (out of borders)', () => {
    gameboard.placeShip('Carrier', [6, 6], 'hor');
    expect(logSpy).toHaveBeenCalledWith('invalid Y coordinates');
    expect(gameboard.gameboard).toEqual(emptyBoard);
  });

  test('place "Destroyer" too close to "Submarine"', () => {
    gameboard.placeShip('Submarine', [4, 4], 'ver');
    gameboard.placeShip('Destroyer', [4, 3], 'ver');
    expect(logSpy).toHaveBeenCalledWith('Sub 4 / 4 FILLED');
    expect(gameboard.gameboard).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, 'Sub', null, null, null, null, null],
      [null, null, null, null, 'Sub', null, null, null, null, null],
      [null, null, null, null, 'Sub', null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });

  test('place "Patrol Boat" too close to "Carrier"', () => {
    gameboard.placeShip('Carrier', [3, 8], 'ver');
    gameboard.placeShip('Patrol Boat', [2, 8], 'ver');
    expect(logSpy).toHaveBeenCalledWith('Car 3 / 8 FILLED');
    expect(gameboard.gameboard).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, 'Car', null],
      [null, null, null, null, null, null, null, null, 'Car', null],
      [null, null, null, null, null, null, null, null, 'Car', null],
      [null, null, null, null, null, null, null, null, 'Car', null],
      [null, null, null, null, null, null, null, null, 'Car', null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });

  test('place "Carrier" too close to "Patrol Boat"', () => {
    gameboard.placeShip('Patrol Boat', [4, 2], 'hor');
    gameboard.placeShip('Carrier', [5, 4], 'hor');
    expect(logSpy).toHaveBeenCalledWith('Pat 4 / 3 FILLED');
    expect(gameboard.gameboard).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, 'Pat', 'Pat', null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });

  test('place "Destroyer" too close to "Submarine"', () => {
    gameboard.placeShip('Submarine', [5, 6], 'ver');
    gameboard.placeShip('Destroyer', [8, 7], 'hor');
    expect(logSpy).toHaveBeenCalledWith('Sub 7 / 6 FILLED');
    expect(gameboard.gameboard).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, 'Sub', null, null, null],
      [null, null, null, null, null, null, 'Sub', null, null, null],
      [null, null, null, null, null, null, 'Sub', null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });

  test('place "Battleship" too close to "Carrier"', () => {
    gameboard.placeShip('Carrier', [7, 2], 'hor');
    gameboard.placeShip('Battleship', [3, 4], 'ver');
    expect(logSpy).toHaveBeenCalledWith('Car 7 / 4 FILLED');
    expect(gameboard.gameboard).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, 'Car', 'Car', 'Car', 'Car', 'Car', null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });
});

describe('hitting ships', () => {
  beforeEach(() => {
    gameboard = new Gameboard();
    logSpy = jest.spyOn(console, 'log');
  });

  test('hit "Carrier" from position 3', () => {
    gameboard.placeShip('Carrier', [5, 2], 'hor');
    gameboard.receiveAttack([5, 4]);
    expect(logSpy).toHaveBeenCalledWith('hitting Carrier from position 3');
    // check if ship's length/position array also registered the hit.
    expect(gameboard.ships[0].length[2]).toEqual('hit');
    expect(gameboard.gameboard).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, 'Car', 'Car', 'hit', 'Car', 'Car', null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });

  test('hit "Submarine" from position 1', () => {
    gameboard.placeShip('Submarine', [3, 3], 'ver');
    gameboard.placeShip('Destroyer', [4, 2], 'hor');
    gameboard.receiveAttack([3, 3]);
    expect(logSpy).toHaveBeenCalledWith('Sub 3 / 3 FILLED');
    expect(logSpy).toHaveBeenCalledWith(
      'occupied by ship nearby (sides or top/bottom and edges)'
    );
    expect(logSpy).toHaveBeenCalledWith('hitting Submarine from position 1');
    expect(gameboard.ships[0].length[0]).toEqual('hit');
    expect(gameboard.gameboard).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, 'hit', null, null, null, null, null, null],
      [null, null, null, 'Sub', null, null, null, null, null, null],
      [null, null, null, 'Sub', null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });

  test('sink a "Battleship"', () => {
    gameboard.placeShip('Battleship', [5, 5], 'ver');
    gameboard.receiveAttack([5, 5]);
    gameboard.receiveAttack([6, 5]);
    gameboard.receiveAttack([7, 5]);
    gameboard.receiveAttack([8, 5]);
    expect(gameboard.ships[0].length[0]).toEqual('hit');
    expect(gameboard.ships[0].length[1]).toEqual('hit');
    expect(gameboard.ships[0].length[2]).toEqual('hit');
    expect(gameboard.ships[0].length[3]).toEqual('hit');
    expect(gameboard.ships[0].isSunk).toBeTruthy();
    expect(gameboard.gameboard).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, 'hit', null, null, null, null],
      [null, null, null, null, null, 'hit', null, null, null, null],
      [null, null, null, null, null, 'hit', null, null, null, null],
      [null, null, null, null, null, 'hit', null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });

  test('all ships to be sunk', () => {
    gameboard.placeShip('Carrier', [3, 3], 'ver');
    gameboard.placeShip('Battleship', [0, 5], 'hor');
    gameboard.placeShip('Destroyer', [6, 6], 'ver');
    gameboard.placeShip('Submarine', [5, 1], 'ver');
    gameboard.placeShip('Patrol Boat', [7, 8], 'ver');
    gameboard.receiveAttack([3, 3]); //-------
    gameboard.receiveAttack([4, 3]); //      |
    gameboard.receiveAttack([5, 3]); //      | Carrier
    gameboard.receiveAttack([6, 3]); //      |
    gameboard.receiveAttack([7, 3]); //-------

    gameboard.receiveAttack([0, 5]); //-------
    gameboard.receiveAttack([0, 6]); //      | Battleship
    gameboard.receiveAttack([0, 7]); //      |
    gameboard.receiveAttack([0, 8]); //-------

    gameboard.receiveAttack([6, 6]); //-------
    gameboard.receiveAttack([7, 6]); //      | Destroyer
    gameboard.receiveAttack([8, 6]); //-------

    gameboard.receiveAttack([5, 1]); //-------
    gameboard.receiveAttack([6, 1]); //      | Submarine
    gameboard.receiveAttack([7, 1]); //-------

    gameboard.receiveAttack([7, 8]); // ------- Patrol Boat
    gameboard.receiveAttack([8, 8]); // -------

    expect(gameboard.checkAllShipsSunk()).toBeTruthy();
  });
});

describe('getting ship info', () => {
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('get "Battleship" info', () => {
    gameboard.placeShip('Battleship', [0, 5], 'hor');
    expect(gameboard.getShip('Battleship')).toEqual({
      shipClass: 'Battleship',
      length: [
        [0, 5],
        [0, 6],
        [0, 7],
        [0, 8],
      ],
      isSunk: false,
    });
  });

  test('get "Destroyer" info', () => {
    gameboard.placeShip('Destroyer', [3, 5], 'ver');
    expect(gameboard.getShip('Destroyer')).toEqual({
      shipClass: 'Destroyer',
      length: [
        [3, 5],
        [4, 5],
        [5, 5],
      ],
      isSunk: false,
    });
  });
});
