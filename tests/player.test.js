import Player from '../src/player';

let playerOne;
let playerAI;

describe('create playes and make then opponents', () => {
  beforeAll(() => {
    playerOne = new Player();
    playerAI = new Player();
  });

  test('playerOne opponent should be playerAI', () => {
    playerOne.opponent = playerAI;
    expect(playerOne.opponent).toBe(playerAI);
  });

  test('playerAI opponent should be playerOne', () => {
    playerAI.opponent = playerOne;
    expect(playerAI.opponent).toBe(playerOne);
  });
});

describe('players creating their own gameboard', () => {
  beforeAll(() => {
    playerOne = new Player();
    playerAI = new Player();
  });

  test('playerOne gameboard', () => {
    expect(playerOne.playerBoard).toEqual({
      gameboard: [
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
      ],
      missedShots: [],
      ships: [],
    });
  });

  test('playerAI gameboard', () => {
    expect(playerAI.playerBoard).toEqual({
      gameboard: [
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
      ],
      missedShots: [],
      ships: [],
    });
  });
});

describe('players placing ships on their gameboards', () => {
  beforeAll(() => {
    playerOne = new Player();
    playerAI = new Player();
  });

  test('playerOne places "Battleship" to [3, 5] in ver pos', () => {
    playerOne.playerBoard.placeShip('Battleship', [3, 5], 'ver');
    expect(playerOne.playerBoard.gameboard).toEqual([
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, 'Bat', null, null, null, null],
      [null, null, null, null, null, 'Bat', null, null, null, null],
      [null, null, null, null, null, 'Bat', null, null, null, null],
      [null, null, null, null, null, 'Bat', null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ]);
  });

  test('playerAI places "Carrier" to [0, 2] in hor pos', () => {
    playerAI.playerBoard.placeShip('Carrier', [0, 2], 'hor');
    expect(playerAI.playerBoard.gameboard).toEqual([
      [null, null, 'Car', 'Car', 'Car', 'Car', 'Car', null, null, null],
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

describe('players attacking their opponent', () => {
  beforeAll(() => {
    playerOne = new Player();
    playerAI = new Player();
    playerOne.opponent = playerAI;
    playerAI.opponent = playerOne;
  });

  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789); // AI attacks random, mocking random return
  });

  // no ships are placed at either gameboards
  test('playerOne attacking opponents gameboard pos [4, 6]', () => {
    playerOne.attacks([4, 6]);
    // opponents gameboard registeres the shot as missed
    expect(playerAI.playerBoard.missedShots[0]).toEqual([4, 6]);
  });

  test('playerAI attacking opponents gameboard at random pos', () => {
    playerAI.AIAttacks();
    expect(playerOne.playerBoard.missedShots[0]).toEqual([1, 1]); // the result will be random
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });
});

describe("playerAI can't attack same position twice", () => {
  beforeAll(() => {
    playerOne = new Player();
    playerAI = new Player();
    playerOne.opponent = playerAI;
    playerAI.opponent = playerOne;
  });
  // no ships on either gameboards
  //   const logSpy = jest.spyOn(console, 'log');

  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789); // AI attacks random, mocking random return
  });

  test('playerAI attacking opponent position at random pos', () => {
    playerAI.AIAttacks();
    expect(playerAI.allShots[0]).toEqual([1, 1]); // the result will be random
  });

  test.todo('playerAI attacking opponent at random pos'); // no idea how to stop recursive call on jest
  //   test('playerAI attacking opponent at random pos', () => {
  //     playerAI.AIAttacks();
  //     expect(logSpy).toHaveBeenCalledWith(
  //       'position is already shot at, retrying'
  //     ); // ^ print this to console and then do AIAttacks again
  //   });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });
});

let currentPlayer;

describe('players take turns by attacking the enemy', () => {
  beforeAll(() => {
    playerOne = new Player('playerOne');
    playerAI = new Player('playerAI');
    playerOne.opponent = playerAI;
    playerAI.opponent = playerOne;
    currentPlayer = playerOne;
  });

  test('playerOne attacking playerAI at pos [4, 4]', () => {
    currentPlayer.attacks([4, 4]);
    currentPlayer = playerOne.opponent;
    expect(playerOne.allShots[0]).toEqual([4, 4]);
    expect(playerAI.playerBoard.missedShots[0]).toEqual([4, 4]);
  });

  test('playerAI turn', () => {
    expect(currentPlayer).toBe(playerAI);
  });
});
