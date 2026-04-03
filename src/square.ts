import { Color, Pos } from "./puzzle.js";

// The squares composes our board
// They are made out of edges but can be undefined if the robot fell off the board
type Square = {color: Color, isStar: boolean} | {
  isStar: boolean;
  color: Color;
  position: Pos;
};

type Edge = {
  isStar: boolean;
  color: Color;
  position: Pos;
};

// Represents the end of the board
const out = {color: Color.NOCOLOR, isStar: false};

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

export { Square, out, squareIsOut, squareIsStar, squareColor, squarePos };
