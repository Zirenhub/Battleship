import Gameboard from '../src/gameboard';

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
      ['Destroyer', null, null, null, null, null, null, null, null, null],
      ['Destroyer', null, null, null, null, null, null, null, null, null],
      ['Destroyer', null, null, null, null, null, null, null, null, null],
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
      [null, null, null, null, null, null, null, null, null, null], // formatting issue
      [
        null,
        null,
        null,
        null,
        null,
        'Submarine',
        'Submarine',
        'Submarine',
        null,
        null,
      ],
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
      [null, null, 'Carrier', null, null, null, null, null, null, null],
      [null, null, 'Carrier', null, null, null, null, null, null, null],
      [null, null, 'Carrier', null, null, null, null, null, null, null],
      [null, null, 'Carrier', null, null, null, null, null, null, null],
      [null, null, 'Carrier', null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });
});
