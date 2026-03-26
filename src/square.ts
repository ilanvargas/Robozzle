import { Color, Pos, Dir } from "./puzzle";

// The squares composes our board
// They are made out of edges but can be undefined if the robot fell off the board
type Square = undefined | {
  isStar: boolean;
  color: Color;
  position: Pos;
  vertices: Array<Square>;    
};

type Edge = {
  isStar: boolean;
  color: Color;
  position: Pos;
  vertices: Array<Square>;    
};

// Represents the end of the board
const out = undefined;

// Verify if we are out of the board

function squareIsOut(aSquare: Square): boolean {
  return aSquare === out;
}

// Attributes functions
// PRECOND: square has to be on the board

function pluck<K extends keyof Edge>(aField: K): (aSquare: Square) => Edge[K] {
  return (aSquare: Square) => {
    return (aSquare as Edge)[aField];
  };
}

const squareIsStar = pluck("isStar");

const squareColor = pluck("color");

const squarePos = pluck("position");

const square2square = (aSquare: Square, aDir: Dir) => pluck("vertices")(aSquare)[aDir];

export { Square, out, squareIsOut, squareIsStar, squareColor, squarePos, square2square };
