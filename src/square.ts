import { Color, Pos, Dir } from "./puzzle";

// Structure of the edges of the board graph
type Edge<T> = {
  isStar: boolean;
  color: Color;
  position: Pos;
  vertices: Array<T>;    
};

// The squares composes our board
// They are made out of edges but can be undefined if the robot fell off the board
type Square = undefined | {
  isStar: boolean;
  color: Color;
  position: Pos;
  vertices: Array<Square>;    
};

// Represents the end of the board
const out = undefined;

// Function to manipulate the squares

function isFellOff(aSquare: Square): boolean {
  return aSquare === out;
}

// PRECOND: The robot is on the board

function move2Square(aSquare: Square, aDir: Dir): Square {
  return (aSquare as Edge<Square>).vertices[aDir];
}

function isStar(aSquare: Square): boolean {
  return (aSquare as Edge<Square>).isStar;
}

function squarePos(aSquare: Square): Pos {
  return (aSquare as Edge<Square>).position;
}

export { Square, out, isFellOff, move2Square, isStar, squarePos };
