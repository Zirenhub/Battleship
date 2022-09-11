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
