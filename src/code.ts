import { Puzzle, Color } from "~src/puzzle"; 
import { Robot, robotColor, moveForward, turnRight, turnLeft } from "~src/robot";
import { Action, State, Funct, actionGame, actionFunct } from "~src/gameState";

const puzzle_id = 330;

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

export { arrayFunct, puzzle_id };
