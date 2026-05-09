import { isWin, Board, boardInit } from "~src/board";
import { Stack, stackIsEmpty, cons, nil, isOverStack } from "~src/stack";
import { Puzzle } from "~src/puzzle";
import { Action, State, Funct, popStateStack } from "~src/gameState";
import { robotIsFell, boardShow } from "~src/robot";
import { readFileSync } from 'node:fs';

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
// Returns last game state
function loop(aState: State, turn: number): State{
  if (stackIsEmpty(aState.stack) || 
      isWin(aState.board) || 
      robotIsFell(aState.robot) ||
      isOverStack(aState.stack)) {
    // game end conditions
    return aState;
  }
  else 
  {    
    // Pop the next action from the stack and execute it, then loop again.
    const nextState = popStateStack(aState);

    console.log(``);
    console.log(`Turn ${turn+1}`);
    boardShow(nextState.board, nextState.robot);
    console.log(nextState.stack);

    return loop(nextState, turn+1);
  }
}

// Main function
// Takes into arguement a puzzle and a list on function to execute game
function main(aPuzzle: Puzzle, arrayFunct: Array<Funct>){
  const newArrayFunct = [
    arrayFunct[0].slice().reverse(),
    arrayFunct[1].slice().reverse(),
    arrayFunct[2].slice().reverse(),
    arrayFunct[3].slice().reverse(),
    arrayFunct[4].slice().reverse(),
  ];

  const state = initState(aPuzzle, newArrayFunct);

  console.log(state.stack);
  boardShow(state.board, state.robot);
  const lastState = loop(state, 0);

  if (isWin(lastState.board))
    console.log(`You won game`);
  else if (stackIsEmpty(lastState.stack))
    console.log(`No more actions`);
  else if (robotIsFell(lastState.robot))
    console.log(`Robot fell out of board`);
  else if (isOverStack(lastState.stack))
    console.log(`Overstack`);
  else
    throw new Error("Unexpected state");
}

function getPuzzles(id: number): Puzzle{   // FIXME : the path should be a parameter
  const jsonData = readFileSync('share/puzzles_extract.json').toString();
  const allPuzzles= JSON.parse(jsonData);
  return allPuzzles.find((p:Puzzle) => p.id === id);
}


export { main, getPuzzles };
