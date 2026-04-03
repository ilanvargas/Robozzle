import { Color, Pos } from "./puzzle.js";

// Definition of a square and the base of an non empty square
// The square is the unit witch is composed the board
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

// Implementation of the "out of the board"
const out = {color: Color.NOCOLOR, isStar: false};

// Returns true if the square is out of the board
function squareIsOut(aSquare: Square): boolean {
  return aSquare === out;
}

// Square's attributes functions
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
