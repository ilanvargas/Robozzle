import { Puzzle, Color } from "~src/puzzle"; 
import { Robot, robotColor, moveForward, turnRight, turnLeft } from "~src/robot";
import { Action, State, Funct, actionGame, actionFunct } from "~src/gameState";
import { main } from "~src/main";

const puzzle = {
  id: 330,
  title: "Learning Stack",
  about: "",
  robotCol: 1,
  robotRow: 11,
  robotDir: 3,
  subs: [3,4,0,0,0],
  allowedCommands: 0,
  board:" rbbbbbbbbbbb    b          B    b               b               b               b               b               b               b               b               b               b              "
};

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

main(puzzle, arrayFunct);
