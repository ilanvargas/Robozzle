import { Puzzle, Color, Dir, puzzleWidth, puzzleHeight } from "~src/puzzle.js";
import { Square, out, squareIsOut } from "~src/square.js";

// The type board is defined by the board plus additionnal information
// We specify the number of stars remaining and the square were the robot starts
// The board itself is an array of squares
type Board = {
  start: Square;
  nbStars: number;
  board: Array<Square>
};

// Creation of the first game board
// Converts a Puzzle into a type BoaCSMA/CDrd
function boardInit(aPuzzle: Puzzle): Board {
  function boardMap(aFunc: (x: string, i: number) => Square, i: number, aStr: string)
    : Array<Square> {
    if (aStr === "")
      return [];
    else
      return [aFunc(aStr.charAt(0), i), ...boardMap(aFunc, i+1, aStr.slice(1))];
  }

  function boardFold(aFunc: (acc: number, curr: string) => number, init: number, aStr: string)
    : number {
    if (aStr === "")
      return 0;
    else
      return boardFold(aFunc, aFunc(init, aStr.charAt(0)), aStr.slice(1));
  }

  const board = boardMap((x, i) => {
    const star = (x === x.toUpperCase()) ? true : false;
    const pos = {x: Math.trunc(i / puzzleWidth), y: i % puzzleWidth};
    switch (x.toLowerCase()) {
      case "b":
        return {isStar: star, color: Color.BLUE, position: pos};
      case "r":
        return {isStar: star, color: Color.RED, position: pos};
      case "g":
        return {isStar: star, color: Color.GREEN, position: pos};
      default:
        return out;
    }
  }, 0, aPuzzle.board);

  const nbStars = boardFold((acc, curr) => (curr.toUpperCase() === curr) ? acc+1 : acc, 
                            0, aPuzzle.board);

  const start = board[aPuzzle.robotRow*puzzleWidth + aPuzzle.robotCol];

  return {start: start, nbStars: nbStars, board: board};
}

// Returns true if player won (no more stars on board)
function isWin(aBoard: Board): boolean {
  return aBoard.nbStars === 0;
}

// Returns the neighbour square on aDir direction
// Will NOT create a new board; problem if we have a board modification
// PRECOND: aSquare is on the board
function move2square(aBoard: Board, aSquare: Square, aDir: Dir): Square {
  const isIn = (i: number) => i > 0 && i < aBoard.board.length;
  const pos = aSquare.position;

  switch (aDir) {
    case Dir.NORD:
      const north = (pos.x-1)*puzzleWidth + pos.y;
      return isIn(north) ? aBoard.board[north] : out;
    case Dir.EAST:
      const east = pos.x*puzzleWidth + pos.y+1;
      return isIn(east) ? aBoard.board[east] : out;
    case Dir.SOUTH:
      const south = (pos.x+1)*puzzleWidth + pos.y;
      return isIn(south) ? aBoard.board[south] : out;
    case Dir.WEST:
      const west = pos.x*puzzleWidth + pos.y-1;
      return isIn(west) ? aBoard.board[west] : out;
    default:
      return out;
  }
}

// Returns a new board without a star on aSquare square
// ARGS:
// - aBoard:  board to be modified
// - aSquare: square to star be removed on new square
// RETURN:
// - a new board
function removeStar(aBoard: Board, aSquare: Square): Board {
  const squareNew = {
    isStar: false,
    color: aSquare.color,
    position: aSquare.position
  };

  return {
    start: aBoard.start,
    nbStars: aBoard.nbStars-1,
    board: aBoard.board.map((e) => {
      if (e === aSquare)
        return squareNew;
      else
        return e;
    })
  }; 
}

export { Board, isWin, move2square, boardInit, removeStar };

