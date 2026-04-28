import { boardShow, Robot } from '../src/robot.js';
import { Board, boardInit } from '../src/board.js';
//import { Dir } from '../src/dir.js';
import { moveForward, turnRight, turnLeft } from '../src/robot.js';
import { puzzleHeight, puzzleWidth } from '../src/puzzle.js';


const aPuzzle = {
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

let newstate = states[states.length - 1];
const game = turnRight(newstate);
console.log("================================");
console.log("||     After turnRight:       ||");
console.log("================================");
boardShow(game.board, game.robot);

let newstates = [game];
for (let i = 1; i < puzzleWidth - 4; i++) {
  const game = moveForward(newstates[newstates.length - 1]);
    newstates.push(game);
    console.log("================================");
    console.log("||     After moveForward:      ||");
    console.log("================================");
    boardShow(game.board, game.robot);
}

let newstate2 = newstates[newstates.length - 1];
const game2 = turnRight(newstate2);
console.log("================================");
console.log("||     After turnRight:       ||");
console.log("================================");
boardShow(game2.board, game2.robot);

const game3 = moveForward(game2);
console.log("================================");
console.log("||     After moveForward:      ||");
console.log("================================");
boardShow(game3.board, game3.robot);

const game4 = turnLeft(game3);
console.log("================================");
console.log("||     After turnLeft:       ||");
console.log("================================");
boardShow(game4.board, game4.robot);

const game5 = turnLeft(game4);
console.log("================================");
console.log("||     After turnLeft:       ||");
console.log("================================");
boardShow(game5.board, game5.robot);



console.log("================================");
console.log("||             fin            ||")
console.log("================================");

