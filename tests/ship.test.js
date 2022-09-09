import Ship from '../src/ship';

const carrier = new Ship('Carrier');
const destroyer = new Ship('Destroyer');
const battleship = new Ship('Battleship');
const submarine = new Ship('Submarine');

test('returns default "Carrier" ship object', () => {
  expect(carrier).toEqual({
    shipClass: 'Carrier',
    length: [1, 2, 3, 4, 5],
    isSunk: false,
  });
});

// test('returns default "Destroyer" ship object', () => {
//   expect(destroyer).toEqual({
//     shipClass: 'Destroyer',
//     length: [0, 1, 2],
//     isSunk: false,
//   });
// });

// hit ship "Battleship" from pos 2 / length 2
battleship.hit(2);

test('"Battleship" is hit from pos 2', () => {
  expect(battleship).toEqual({
    shipClass: 'Battleship',
    length: [1, 'hit', 3, 4],
    isSunk: false,
  });
});

destroyer.hit(1);
destroyer.hit(2);
destroyer.hit(3);

test('"Destroyer" has sunk', () => {
  expect(destroyer.isSunk).toBeTruthy();
});

test('return "Submarine" length', () => {
  expect(submarine.getLength()).toBe(3);
});
