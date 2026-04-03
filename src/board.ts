import { Puzzle, Color, Dir, puzzleWidth } from "./puzzle.js";
import { Square, out, squareIsOut, squareIsStar, squareColor, squarePos } from "./square.js";

// The type board is defined by the board plus additionnal information
// We specify the number of stars remaining and the square were the robot starts
// The board itself is an array of squares
type Board = {
  start: Square;
  nbStars: number;
  board: Array<Square>
};

// Creation of board
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

function isValid(aSquare: Square): boolean {
  return aSquare !== out;
}


function colorWithStar(aColor: number): string {
  switch (aColor) {
    case 0:
      return "B";
    case 1:
      return "G";
    case 2:
      return "R";
    default:
      return "?";
  }
}


function colorWithoutStar(aColor: number): string {
  switch (aColor) {
    case 0:
      return "b";
    case 1:
      return "g";
    case 2:
      return "r";
    default:
      return "?";
  }
}



function boardShow(aBoard: Board) {
  for (let y = 0; y < PuzzleHeight; y++) {
    let line = "";
    for (let x = 0; x < PuzzleWidth; x++) {
      const square = aBoard.board[y * PuzzleWidth + x];
      line += isValid(square) ? square.isStar ? colorWithStar(square.color) : colorWithoutStar(square.color) : "#";
    }
    console.log(line);
  }
}

// Move to a neighbour square on aDir direction
// Will NOT create a new board; problem if we have a board modification
function move2square(aSquare: Square, aDir: Dir) {return out;}

export { Board, isWin, move2square, boardInit };
