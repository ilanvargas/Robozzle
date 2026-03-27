import { Puzzle, Dir } from "./puzzle.js";
import { Square, out, squareIsOut, squareIsStar, squareColor, squarePos, squareNeighbours } from "./square.js";

type Board = {
  start: Square;
  nbStars: number;
};

//function boardInit(aPuzzle: Puzzle): Board

//Creates a test board that contains only the starting position (0,0) and the position (0,1) containing the star 
function boardInit(aPuzzle: Puzzle){
  const aBoard = {
    start: {
      isStar: false,
      color: 0,
      position: {
        x: 0,
        y: 0
      },
      vertices: [{isStar: true, color: 0, position: {x: 0,y: 1}, vertices: [out, out, out, out]}, out, out, out]
    },
    nbStars: 1
  };
  return aBoard;
}

function isWin(aBoard: Board) {
  return aBoard.nbStars === 0;
}

// Move to a neighbour square on aDir direction
// Will NOT create a new board; problem if we have a board modification
function move2square(aSquare: Square, aDir: Dir) {
  return squareNeighbours(aSquare)[aDir];
}

export { Board, isWin, move2square, boardInit };
