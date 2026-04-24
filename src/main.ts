import { isWin, Board, boardInit } from "~src/board.js";
import { Stack, stackIsEmpty, cons, nil } from "~src/stack.js";
import { Puzzle } from "~src/puzzle.js";
import { Action, State, Funct, popStateStack } from "~src/gameState.js";
import { robotIsFell } from "~src/robot.js";

// Returns first state based on puzzle and the funct list
function initState(aPuzzle: Puzzle, arrayFunct: Array<Funct>): State {
  const board = boardInit(aPuzzle);

  return {
    robot: {
      square: board.start,
      dir: aPuzzle.robotDir
    },
    board: board,
    stack: arrayFunct[0].reduce(
      (acc: Stack<Action>, curr: Action) => cons(curr, acc), nil)
  };
}

// Game loop
// Each loop changes game state
function loop(aState: State): void{
  if (stackIsEmpty(aState.stack) || isWin(aState.board) || robotIsFell(aState.robot)) {
    // game end conditions
    return ;
  }
  else 
  {    
    // Pop the next action from the stack and execute it, then loop again.
    const nextState = popStateStack(aState);
    loop(nextState);
    return;
  }
}

// Main function
// Takes into arguement a puzzle and a list on function to execute game
function main(aPuzzle: Puzzle, arrayFunct: Array<Funct>){
  const state = initState(aPuzzle, arrayFunct);
  loop(state);
}


