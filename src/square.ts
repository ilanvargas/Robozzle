import { Color, Pos } from "~src/puzzle.js";

// Definition of a square and the base of an non empty square
// The square is the unit witch is composed the board
type Square = {
  isStar: boolean;
  color: Color;
  position: Pos;
};

// Implementation of the "out of the board"
const out = {color: Color.NOCOLOR, isStar: false, position: {x: -1, y: -1}};

// Returns true if the square is out of the board
function squareIsOut(aSquare: Square): boolean {
  return aSquare === out;
}

export { Square, out, squareIsOut };
