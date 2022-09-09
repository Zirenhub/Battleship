import Gameboard from '../src/gameboard';
import Ship from '../src/ship';

let gameboard = Gameboard;
let ship = Ship;

beforeEach(() => {
  gameboard = new Gameboard();
  ship = new Ship('Destroyer');
});

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
