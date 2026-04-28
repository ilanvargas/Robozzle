import { isWin, Board, boardInit } from "~src/board";
import { Stack, stackIsEmpty, cons, nil } from "~src/stack";
import { Puzzle } from "~src/puzzle";
import { Action, State, Funct, popStateStack } from "~src/gameState";
import { robotIsFell } from "~src/robot";

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


