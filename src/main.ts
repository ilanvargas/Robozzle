import { isWin, Board, boardInit } from "#src/board.js";
import { Stack, stackIsEmpty, cons, nil } from "#src/stack.js";
import { Puzzle } from "#src/puzzle.js";
import { State, popStateStack } from "#src/gameState.js";
import { robotIsFell } from "#src/robot.js";

// Returns first state based on puzzle and the funct list
function initState(aPuzzle: Puzzle, listFunc: (state: State) => State[]): State {
  const board = boardInit(aPuzzle);

  return {
    robot: {
      square: board.start,
      dir: aPuzzle.robotDir
    },
    board: board,
    stack: cons(listFunc, nil)
  };
}

// Game loop
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
function main(aPuzzle: Puzzle, listFunc: (state: State) => State[]){
  const state = initState(aPuzzle, listFunc);
  loop(state);
}


