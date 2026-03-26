import { Dir, Color, Pos } from "./puzzle";
import { Square, out, isFellOff, squareColor, isStar, squarePos, move2Square } from "./square";

// Robot definiton
// It is on a square (position int the board) and directed on a dir
type Robot = {
  square: Square;
  dir: Dir;
}

// Verification functions on robot

function isRobotFell(aRobot: Robot): boolean {
  return isFellOff(aRobot.square);
}

function isOnStar(aRobot: Robot): boolean {
  return isStar(aRobot.square);
}

// Atributes functions on robot

function robotColor(aRobot: Robot): Color {
  return squareColor(aRobot.square);
}

function robotPos(aRobot: Robot): Pos {
  return squarePos(aRobot.square);
}

// Action funcitons on robot
// We create a new robot with the modifications

// TODO: Crée un nouveau graph si le robot tombe sur une étoile
function moveForward(aRobot: Robot): Robot {
  const robotNew: Robot = {
    square: move2Square(aRobot.square, aRobot.dir),
    dir: aRobot.dir
  };
  return robotNew;
}

function turnRight(aRobot: Robot): Robot {
  const robotNew = {
    square: aRobot.square,
    dir: (aRobot.dir + 1) % Dir.MAXDIRS
  };
  return robotNew;
}

function turnLeft(aRobot: Robot): Robot {
  const robotNew = {
    square: aRobot.square,
    dir: (aRobot.dir - 1) % Dir.MAXDIRS
  };
  return robotNew;
}

export { isRobotFell, isOnStar, robotColor, robotPos, moveForward, turnRight, turnLeft };
