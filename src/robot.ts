import { Dir } from "./puzzle";
import { Square, isFellOff, move2Square, isStar, squarePos } from "./square";

// Robot definiton
// It is on a square (position int the board) and directed on a dir
type Robot = {
  square: Square;
  dir: Dir;
}

// Verification function on robot

function isOnStar(aRobot: Robot): boolean {
  return isStar(aRobot.square);
}

function isRobotFell(aRobot: Robot): boolean {
  return isFellOff(aRobot.square);
}

// Action funcitons on robot

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

