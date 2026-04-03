import { Dir, Color, Pos } from "./puzzle.js";
import { Square, out, squareIsOut, squareIsStar, squareColor, squarePos } from "./square.js";
import { Board, isWin, move2square } from "./board.js";

// Definition of the robot
// The robot is defined by the square witch it is in and the direction witch is pointing
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

// We wrap board and robot into game type
type Game = {
  robot: Robot;
  board: Board;
}

// Action functions on robot
// ARGS: the current game (robot and board)
// RETURNS: updated game
// POSTCOND: the current game (and its attributes) are not modified

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

// Regrouping all of the robot's actions
const robotActionArray = [
  moveForward,
  turnRight,
  turnLeft
];

export { Robot, robotIsFell, robotIsStar, robotColor, robotPos, Game, robotActionArray };
