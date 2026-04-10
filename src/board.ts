import { Puzzle, Color, Dir, puzzleWidth, puzzleHeight } from "./puzzle.js";
import { Square, out, squareIsOut, squareIsStar, squareColor, squarePos } from "./square.js";

// The type board is defined by the board plus additionnal information
// We specify the number of stars remaining and the square were the robot starts
// The board itself is an array of squares
type Board = {
  start: Square;
  nbStars: number;
  board: Array<Square>
};

// Creation of the first game board
// Converts a Puzzle into a type Board
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

  const start = board[aPuzzle.robotCol*puzzleWidth + aPuzzle.robotRow];

  return {start: start, nbStars: nbStars, board: board};
}

// Returns true if player won
function isWin(aBoard: Board) {
  return aBoard.nbStars === 0;
}


// return the neighbour square on aDir direction
// Will NOT create a new board; problem if we have a board modification
// PRECOND: aSquare is on the board
function move2square(aBoard: Board, aSquare: Square, aDir: Dir) {
  const pos = squarePos(aSquare);
  switch (aDir) {
    case Dir.NORD:
      const north = aBoard.board[(pos.x-1)*puzzleWidth + pos.y];
      return squareIsOut(north) ? out : north;
    case Dir.EAST:
      const east = aBoard.board[pos.x*puzzleWidth + pos.y+1];
      return squareIsOut(east) ? out : east;
    case Dir.SOUTH:
      const south = aBoard.board[(pos.x+1)*puzzleWidth + pos.y];
      return squareIsOut(south) ? out : south;
    case Dir.WEST:
      const west = aBoard.board[pos.x*puzzleWidth + pos.y-1];
      return squareIsOut(west) ? out : west;
    default:
      return out;
  }
}


export { Board, isWin, move2square, boardInit };
