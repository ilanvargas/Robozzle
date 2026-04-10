
// Puzzle size
const puzzleWidth = 12;
const puzzleHeight = 10;

// Definition of a "raw puzzle"
// A puzzle so it's given by the json
type Puzzle = {
  id: number,
  title: string,
  about: string,
  robotCol: number,
  robotRow: number,
  robotDir: number,
  subs: Array<number>,
  allowedCommands: number,
  board: string
}

// Enumeration of the directions
enum Dir {
  NORD,
  EAST,
  SOUTH,
  WEST,
  MAXDIRS
};

// Enumeration of the colors in the board
enum Color {
  NOCOLOR,
  BLUE,   
  GREEN,
  RED,
  MAXCOLORS
};

// Definition of a position
interface Pos {
  x: number;
  y: number;
};

export { Puzzle, Dir, Color, Pos, puzzleWidth, puzzleHeight};



