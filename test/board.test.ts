import * as bo from "../src/board.js";
import * as ro from "../src/robot.js";
// import { Color } from "#src/puzzle.js";
// import { Puzzle, Color, Dir, puzzleWidth, puzzleHeight } from "../src/puzzle.js";
const aPuzzle = {id:14, title:"Can you reach the stars?", about:"This puzzle is dedicated to those that enjoy bad puns.",
                robotCol:1, robotRow:8, robotDir:3, subs:[10,2,2,0,0], allowedCommands:0,
                board:"                     rrr         rr rrBrrrr rrr  brrrBbBrBrrrBr  bBrBbBbbbbrbbb  bbbbbrbbbBBbBb  bbBBrrbbbrrbbb  bBrrrrrBrrrrBr  rrr   rbr  rrr        rBr             rrr                      "
                };

const bor = bo.boardInit(aPuzzle);
const robot = {square: bor.start, dir:3};
ro.boardShow(bor, robot);

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


console.log("\n");
const bor2 = bo.boardInit(puzzle);    
const robot2 = {square: bor2.start, dir:3};
ro.boardShow(bor2,robot2);

// describe('Board test suite', () => {
//     test('if board is win', () => {
//         const square1 = sq.out;
//         expect(sq.squareIsOut(square1)).toBe(true);
//     });
// });
