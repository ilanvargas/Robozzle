import { isWin, Board, boardInit } from "./board.js";
import { squareColor } from "./square.js";
import { Stack, stackIsEmpty, nil } from "./stack.js";
import { Puzzle } from "./puzzle.js";
import { State, popStateStack } from "./gameState.js";
import { robotIsFell } from "./robot.js";

//const listFunc;

function initState(aPuzzle: Puzzle){
  const board = boardInit(aPuzzle);

  return {
    robot: {
      square: board.start,
      Dir: 0
    },
    board: board,
    stack: nil
  };
}

function loop(aState: State){
  let state = aState;
  // Continue to execute actions until stack empties or end conditions are met.
  if (stackIsEmpty(state.stack) || isWin(state.board) || robotIsFell(state.robot)) {
    return ;
  }
  else {    // Pop the next action from the stack and execute it, then loop again.
    const nextState = popStateStack(state);
    return loop(nextState);
  }
}





// const state = initState(aPuzzle);
// const finalState = loop(state);
// console.log(finalState);



