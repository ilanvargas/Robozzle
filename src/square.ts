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

// Attributes functions

function isFellOff(aSquare: Square): boolean {
  return aSquare === out;
}

function squareColor(aSquare: Square): Color {
  return aSquare.color;
}

function isStar(aSquare: Square): boolean {
  return (aSquare as Edge<Square>).isStar;
}

function squarePos(aSquare: Square): Pos {
  return (aSquare as Edge<Square>).position;
}

// Function to manipulate the squares
// return an other square
// PRECOND: The robot is on the board

function move2Square(aSquare: Square, aDir: Dir): Square {
  return (aSquare as Edge<Square>).vertices[aDir];
}



export { Square, out, isFellOff, squareColor, isStar, squarePos, move2Square };
