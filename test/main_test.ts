import { Puzzle, Color } from "~src/puzzle";
import { Robot, robotColor, moveForward, turnRight, turnLeft, boardShow } from "~src/robot";
import { Action, State, Funct, actionGame, actionFunct } from "~src/gameState";
import { main, getPuzzles } from "~src/main";
import { boardInit } from "~src/board";

const arrayFunct: Array<Funct> = [[
    actionFunct(() => arrayFunct[1]),
    actionGame(turnRight),
    actionGame(moveForward)
  ],
  [
    actionGame(moveForward),
    actionGame(turnRight, (r: Robot) => robotColor(r) === Color.RED),
    actionFunct(() => arrayFunct[1], (r: Robot) => robotColor(r) === Color.BLUE),
    actionGame(moveForward)
  ],
  [], [], []
];

/*
-- Exemple de comment on peut récupérer un puzzle a partir de son ID --
*/
const puzzle1 = getPuzzles(329);
if (puzzle1) {
  console.log("Puzzle trouvé :", puzzle1.title);
  // Ici aStr sera bien la longue chaîne de caractères, et charAt(0) marchera !
  const aBoard = boardInit(puzzle1);
  const robot = {
    square: aBoard.start,
    dir: puzzle1.robotDir
  };
  const aGame = {
    robot: robot,
    board: aBoard
  };
  boardShow(aBoard, aGame.robot);
  // main(puzzle1, arrayFunct);
} else {
  console.error("Erreur : Aucun puzzle trouvé avec cet ID.");
}



