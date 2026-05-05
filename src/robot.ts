import { Dir, Color, Pos, puzzleHeight, puzzleWidth } from "../src/puzzle.js";
import { Square, out, squareIsOut } from "../src/square.js";
import { Board, isWin, move2square, removeStar } from "../src/board.js";

// Definition of the robot
// The robot is defined by the square witch it is in and the direction witch is pointing
type Robot = {
  square: Square;
  dir: Dir;
}

// Attribute functions on robot based of square

function generalSquare<K extends keyof Square>(key: K): (aRobot: Robot) => Square[K] {
  return (aRobot: Robot) => {
    return aRobot.square[key];
  };
}
const robotIsStar = generalSquare('isStar');
const robotColor = generalSquare('color');
const robotIsFell = (aRobot: Robot) => squareIsOut(aRobot.square);

// We wrap board and robot into game type
type Game = {
  robot: Robot;
  board: Board;
}

// Action functions on robot
// ARGS: the current game (robot and board)
// RETURNS: updated game
// POSTCOND: the current game (and its attributes) are not modified

function moveForward(g: Game): Game {
  const squareNew = move2square(g.board, g.robot.square, g.robot.dir);
  const robotNew: Robot = {
    square: squareNew,
    dir: g.robot.dir
  };

  if (squareNew.isStar)
    return {
      robot: robotNew,
      board: removeStar(g.board, g.robot.square)
    };
  else
    return {
      robot: robotNew, 
      board: g.board
    };
}

function turnRight(g: Game): Game {
  const robotNew = {
    square: g.robot.square,
    dir: (g.robot.dir + 1) % Dir.MAXDIRS
  };

  return {robot: robotNew, board: g.board};
}

function turnLeft(g: Game): Game {
  const robotNew = {
    square: g.robot.square,
    dir: (g.robot.dir - 1 + Dir.MAXDIRS) % Dir.MAXDIRS
  };
  
  return {robot: robotNew, board: g.board};
}

// Regrouping all of the robot's actions
const robotActionArray = [
  moveForward,
  turnRight,
  turnLeft
];


// TUI interpretation of board
function boardShow(aBoard: Board, aRobot: Robot){
  function colorWithStar(aColor: number): string {
    switch (aColor) {
      case Color.BLUE:
        return "B";
      case Color.GREEN:
        return "G";
      case Color.RED:
        return "R";
      default:
        return "?";
    }
  }

  function colorWithoutStar(aColor: number): string {
    switch (aColor) {
      case Color.NOCOLOR:
        return "#";
      case Color.BLUE:
        return "b";
      case Color.GREEN:
        return "g";
      case Color.RED:
        return "r";
      default:
        return "?";
    }
  }

  for (let y = 0; y < puzzleHeight; y++) {
    let line = "";
    for (let x = 0; x < puzzleWidth; x++) {
      const square = aBoard.board[y * puzzleWidth + x];
      if (square === aRobot.square) 
        if (aRobot.dir === Dir.EAST)
          line += ">";
        else if (aRobot.dir === Dir.WEST)
          line += "<";
        else if (aRobot.dir === Dir.NORD)
          line += "^";
        else
          line += "v";
      else
        line += square.isStar ? colorWithStar(square.color) : colorWithoutStar(square.color);
    }
    console.log(line);
  }
}

export { Robot, robotIsFell, robotIsStar, robotColor, Game, robotActionArray };
export { moveForward, turnRight, turnLeft, boardShow };
