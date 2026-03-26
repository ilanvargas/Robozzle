import { Dir, Color, Pos } from "./puzzle";
import { Square, out, squareIsOut, squareIsStar, squareColor, squarePos, square2square } from "./square";

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

// TODO: Crée un nouveau graph si le robot tombe sur une étoile
function moveForward(aRobot: Robot): Robot {
  const robotNew: Robot = {
    square: square2square(aRobot.square, aRobot.dir),
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

export { Robot, robotIsFell, robotIsStar, robotColor, robotPos, moveForward, turnRight, turnLeft };
