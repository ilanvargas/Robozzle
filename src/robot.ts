import { Dir, Color, Pos } from "./puzzle.js";
import { Square, out, squareIsOut, squareIsStar, squareColor, squarePos } from "./square.js";
import { Board, isWin, move2square } from "./board.js";

// Robot definiton
// It is on a square (position int the board) and directed on a dir
type Robot = {
  square: Square;
  dir: Dir;
}

// Attribute functions on robot based of square

function generalSquare<K>(aFunction: (aSquare: Square) => K): (aRobot: Robot) => K {
  return (aRobot: Robot) => {
    return aFunction(aRobot.square);
  };
}

const robotIsFell = generalSquare(squareIsOut);

const robotIsStar = generalSquare(squareIsStar);

const robotColor = generalSquare(squareColor);

const robotPos = generalSquare(squarePos);

// Action functions on robot
// We create a new robot with the modifications
// Can create a new board if modified

// We wrap board and robot into game type
type Game = {
  robot: Robot;
  board: Board;
}

// TODO: Crée un nouveau graph si le robot tombe sur une étoile
function moveForward(g: Game): Game {
  const robotNew: Robot = {
    square: move2square(g.robot.square, g.robot.dir),
    dir: g.robot.dir
  };

  return {robot: robotNew, board: g.board};
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
    dir: (g.robot.dir - 1) % Dir.MAXDIRS
  };
  
  return {robot: robotNew, board: g.board};
}

const robotActionArray = [
  moveForward,
  turnRight,
  turnLeft
];

export { Robot, robotIsFell, robotIsStar, robotColor, robotPos, Game, robotActionArray };
