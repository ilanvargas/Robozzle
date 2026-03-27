import { Puzzle, Dir } from "./puzzle";
import { Square, out, squareIsOut, squareIsStar, squareColor, squarePos, squareNeighbours } from "./square";

type Board = {
  start: Square;
  nbStars: number;
};

//function boardInit(aPuzzle: Puzzle): Board

function isWin(aBoard: Board) {
  return aBoard.nbStars === 0;
}

// Move to a neighbour square on aDir direction
// Will NOT create a new board; problem if we have a board modification
function move2square(aSquare: Square, aDir: Dir) {
  return squareNeighbours(aSquare)[aDir];
}

export { Board, isWin, move2square };
