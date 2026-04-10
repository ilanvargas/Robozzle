import { isWin, Board, boardInit } from "./board.js";
import { squareColor } from "./square.js";
import { Stack, stackIsEmpty, nil, cons } from "./stack.js";
import { Puzzle } from "./puzzle.js";
import { State, popStateStack } from "./gameState.js";
import { robotIsFell } from "./robot.js";

//const listFunc;

function initState(aPuzzle: Puzzle, listFunc: (state: State) => State[]): State {
  const board = boardInit(aPuzzle);

  return {
    robot: {
      square: board.start,
      dir: 0
    },
    board: board,
    stack: cons(listFunc, nil)
  };
}

function loop(aState: State){
  const state = aState;
  // Continue to execute actions until stack empties or end conditions are met.
  if (stackIsEmpty(state.stack) || isWin(state.board) || robotIsFell(state.robot)) {
    return ;
  }
  else {    // Pop the next action from the stack and execute it, then loop again.
    const nextState = popStateStack(state);
    return loop(nextState);
  }
}

function main(aPuzzle: Puzzle, listFunc: (state: State) => State[]){
  const state = initState(aPuzzle, listFunc);
  const finalState = loop(state);
  console.log(finalState);
}




// const state = initState(aPuzzle);
// const finalState = loop(state);
// console.log(finalState);



