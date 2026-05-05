import * as bo from "~src/board";
import * as sq from "~src/square";
import { Color, Dir, puzzleWidth, puzzleHeight } from "~src/puzzle";

describe('Board test suite', () => {
  const noStarPuzzle = {
    id: 1,
    title: "Simple Test",
    about: "A simple test board",
    robotCol: 1,
    robotRow: 0,
    robotDir: Dir.EAST,
    subs: [0, 0, 0, 0, 0],
    allowedCommands: 0,
    board: "rbbbbbbbbbbr                                                                                                                                                                                   "
  };
  const simplePuzzle = {
    id: 1,
    title: "Simple Test",
    about: "A simple test board",
    robotCol: 1,
    robotRow: 1,
    robotDir: Dir.EAST,
    subs: [0, 0, 0, 0, 0],
    allowedCommands: 0,
    board: "RbbbbbbbbbbR    "+
           "RbbbbbbbbbbR    "+
           "RbbbbbbbbbbR    "+
           "                "+
           "                "+
           "                "+
           "                "+
           "                "+
           "                "+
           "                "+
           "                "+
           "                "
  };

  describe('boardInit', () => {
    const board = bo.boardInit(simplePuzzle);

    test('should initialize a board from a puzzle', () => {
      expect(board).toBeDefined();
      expect(board.board).toBeDefined();
      expect(board.start).toBeDefined();
      expect(board.nbStars).toBeDefined();
    });

    test('should correctly count the number of stars', () => {
      expect(board.nbStars).toBe(6); 
    });

    test('should set the start position correctly', () => {
      expect(board.start.position.x).toBe(simplePuzzle.robotRow);
      expect(board.start.position.y).toBe(simplePuzzle.robotCol);
    });

    test('should correctly identify colors in the board', () => {
      expect(board.board[0].color).toBe(Color.RED);
      expect(board.board[11].color).toBe(Color.RED);
      for (let i = 1; i < 11; i++) {
        expect(board.board[i].color).toBe(Color.BLUE);
      }
    });

    test('should correctly identify starred squares', () => {
      expect(board.board[0].isStar).toBe(true);
      expect(board.board[11].isStar).toBe(true);
      for (let i = 1; i < 11; i++) {
        expect(board.board[i].isStar).toBe(false);
      }
    });

    test('should handle empty spaces in the board', () => {
      const outSquares = board.board.filter(s => sq.squareIsOut(s));
      expect(outSquares.length).toBe(156);
    });
  });

  describe('isWin', () => {
    test('should return false when there are stars remaining', () => {
      const board = bo.boardInit(simplePuzzle);
      expect(bo.isWin(board)).toBe(false);
    });

    test('should return true when no stars are remaining', () => {
      const board = bo.boardInit(noStarPuzzle);
      expect(bo.isWin(board)).toBe(true);
    });
  });

  describe('move2square', () => {
    test('should move north correctly', () => {
      const board = bo.boardInit(simplePuzzle);
      const startSquare = board.start;

      const northSquare = bo.move2square(board, startSquare, Dir.NORD);
      expect(northSquare.position.x).toBe(startSquare.position.x - 1);
      expect(northSquare.position.y).toBe(startSquare.position.y);
      expect(northSquare.color).toBe(Color.BLUE);
      expect(northSquare.isStar).toBe(false);
    });

    test('should move south correctly', () => {
      const board = bo.boardInit(simplePuzzle);
      const startSquare = board.start;

      const southSquare = bo.move2square(board, startSquare, Dir.SOUTH);
      expect(southSquare.position.x).toBe(startSquare.position.x + 1);
      expect(southSquare.position.y).toBe(startSquare.position.y);
      expect(southSquare.color).toBe(Color.BLUE);
      expect(southSquare.isStar).toBe(false);
    });

    test('should move east correctly', () => {
      const board = bo.boardInit(simplePuzzle);
      const startSquare = board.start;
      
      const eastSquare = bo.move2square(board, startSquare, Dir.EAST);
      expect(eastSquare.position.x).toBe(startSquare.position.x);
      expect(eastSquare.position.y).toBe(startSquare.position.y + 1);
      expect(eastSquare.color).toBe(Color.BLUE);
      expect(eastSquare.isStar).toBe(false);
    });

    test('should move west correctly', () => {
      const board = bo.boardInit(simplePuzzle);
      const startSquare = board.start;
        
      const westSquare = bo.move2square(board, startSquare, Dir.WEST);
      expect(westSquare.position.x).toBe(startSquare.position.x);
      expect(westSquare.position.y).toBe(startSquare.position.y - 1);
      expect(westSquare.color).toBe(Color.RED);
      expect(westSquare.isStar).toBe(true);
    });

    test('Return out if out of board', () => {
      const board = bo.boardInit(noStarPuzzle);
      const startSquare = board.start;
        
      const boundSquare = bo.move2square(board, startSquare, Dir.NORD);
      expect(sq.squareIsOut(boundSquare)).toBe(true);
    });

    test('Return out if empty', () => {
      const board = bo.boardInit(noStarPuzzle);
      const startSquare = board.start;
        
      const outSquare = bo.move2square(board, startSquare, Dir.SOUTH);
      expect(sq.squareIsOut(outSquare)).toBe(true);
    });
  });

  describe('removeStar', () => {
    const board = bo.boardInit(simplePuzzle);
    const starSquare = board.board[0];
    const newBoard = bo.removeStar(board, starSquare);

    test('remove selected star from the board', () => {
      expect(newBoard.board[0].isStar).toBe(false);
    });

    test('global number of star decresed by one', () => {
      expect(newBoard.nbStars).toBe(5);
    });

    test('should preserve other squares', () => {
      for (let i = 1; i < 10; i++) {
        expect(newBoard.board[i]).toBe(board.board[i]);
      }
    });
  });
});
