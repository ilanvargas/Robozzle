import { boardShow, Robot } from '../src/robot.js';
import { Board, boardInit } from '../src/board.js';
//import { Dir } from '../src/dir.js';
import { moveForward } from '../src/robot.js';
import { puzzleHeight } from '../src/puzzle.js';


const aPuzzle = {
  id: 330,
  title: "Learning Stack",
  about: "",
  robotCol: 1,
  robotRow: 11,
  robotDir: 2,
  subs: [3,4,0,0,0],
  allowedCommands: 0,
  board:" rbbbbbbbbbbb    b          B    b               b               b               b               b               b               b               b               b               b              "
};
const aBoard = boardInit(aPuzzle);


const robot: Robot = {
  square: aBoard.start,
  dir: aPuzzle.robotDir
};

const aGame = {
  robot: robot,
  board: aBoard
};

console.log("Initial board:");
boardShow(aGame.board, aGame.robot);

const states = [aGame];
for (let i = 1; i < puzzleHeight; i++) {
  const game = moveForward(states[states.length - 1]);
  states.push(game);
  console.log("================================");
  console.log("||     After moveForward:      ||");
  console.log("================================");
  boardShow(game.board, game.robot);
}
