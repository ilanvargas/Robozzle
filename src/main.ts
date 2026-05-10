import { isWin, Board, boardInit } from "~src/board";
import { Stack, stackIsEmpty, cons, nil, isOverStack, head, tail } from "~src/stack";
import { Puzzle, Color, puzzleWidth, puzzleHeight } from "~src/puzzle";
import { Action, State, Funct, popStateStack, verifyArrayFunc } from "~src/gameState";
import { robotIsFell, boardShow } from "~src/robot";
import { arrayFunct, puzzle_id } from "~src/code";
import allPuzzles from "../share/puzzles_extract.json";

// Returns first state based on puzzle and the funct list
function initState(aPuzzle: Puzzle, arrayFunct: Array<Funct>): State {
  const board = boardInit(aPuzzle);

  return {
    robot: {
      square: board.start,
      dir: aPuzzle.robotDir
    },
    board: board,
    stack: arrayFunct[0].
      slice().
      reverse().
      reduce(
      (acc: Stack<Action>, curr: Action) => cons(curr, acc), nil)
  };
}

// End condition 
function isEnd(aState: State): boolean {
  if (stackIsEmpty(aState.stack) || 
      isWin(aState.board) || 
      robotIsFell(aState.robot) ||
      isOverStack(aState.stack))
    return true;
  else
    return false;
}

// Type used in html
type RobotUI = {
  x: number,
  y: number,
  dir: number
}
type StateUI = {
  board: Array<string>,
  robot: RobotUI
}

// gives UI appropriate state
function stateToUI(aState: State): StateUI {
  function colorWithStar(aColor: Color) {
    switch (aColor) {
      case Color.BLUE: return "B";
      case Color.GREEN: return "G";
      case Color.RED: return "R";
      default: return "?";
    }
  }
  function colorWithoutStar(aColor: Color) {
    switch (aColor) {
      case Color.NOCOLOR: return " "; 
      case Color.BLUE: return "b";
      case Color.GREEN: return "g";
      case Color.RED: return "r";
      default: return "?";
      }
  }

  const boardUI = [];
  for (let y = 0; y < puzzleHeight; y++) {
      let line = "";
      for (let x = 0; x < puzzleWidth; x++) {
          const square = aState.board.board[y * puzzleWidth + x];
          line += square.isStar
              ? colorWithStar(square.color)
              : colorWithoutStar(square.color);
      }
      boardUI.push(line);
  }

  const robotUI = {
    x: aState.robot.square.position.x,
    y: aState.robot.square.position.y,
    dir: aState.robot.dir
  };

  return {
    board: boardUI,
    robot: robotUI
  };
}

// -- UI interaction --

// Get puzzle in data base from id
function getPuzzle(id: number): Puzzle | undefined {
  return allPuzzles.find((p) => p.id === id);
}

const puzzle = getPuzzle(puzzle_id);
verifyArrayFunc(puzzle, arrayFunct);
if (puzzle === undefined)
  throw new Error("Puzzle not found");

// ONLY MUTABLE ON PROGRAM other than visual functions
let stateStack = cons(initState(puzzle, arrayFunct), nil);

// Restats stack
function restart() {
  stateStack = cons(initState(puzzle!, arrayFunct), nil);
}

// Current state
function headState(): StateUI {
  return stateToUI(head(stateStack));
}

// Verifies if the game is over
// Way to access stateStack through UI
function isDone(): boolean {
  const currState = head(stateStack);
  return isEnd(currState);
}

// Advances only one step
// PRECOND: isEnd condition is false
// Its the job of UI to verify with isDone function
function step(): StateUI {
  const currState = head(stateStack);
  const nextState = popStateStack(currState);
  stateStack = cons(nextState, stateStack);

  return stateToUI(nextState);
}


// Goes back one step
function back(): StateUI {
  if (stackIsEmpty(tail(stateStack)))
    return stateToUI(head(stateStack)); //stateStack can never be empty
  else {
    stateStack = tail(stateStack);
    return stateToUI(head(stateStack));
  }
}

export { headState, step, back, isDone, restart };
