import { Stack, cons, head, tail } from "./stack.js";
import { Board } from "./board.js";
import { Robot, Game } from "./robot.js";

// Definition of an action applicable on the game state
// Returns a new state with the action's modifications
type Action = (aState: State) => State;

// A game state is composed of the board, robot (Game) and stack with the actions to do
type State = {
  robot: Robot;
  board: Board;
  stack: Stack<Action>;
};

// A game function is an array of action
// IMPORTANT: For stack implementation the array is reversed, the first element is on the
// last position
// This is done so it can become the head of the stack
type Funct = Array<Action>

// Transforms an action on the game to an action on the game state
function actionGame(funGame: (g: Game) => Game): Action {
  return (aState: State) => {
    const gNew = funGame({ robot: aState.robot, board: aState.board });

    return {
      robot: gNew.robot,
      board: gNew.board,
      stack: tail(aState.stack)
    };
  };
}

// Implements going to a game function as an action
// This means adding function's actions to the state's stack
function actionFunct(aFunct: Funct): Action {
  return (aState: State) => {
    const stackNew = aFunct.
      reduce((acc: Stack<Action>, curr: Action) => 
              cons(curr, acc), 
             tail(aState.stack));

    return {
      robot: aState.robot,
      board: aState.board,
      stack: stackNew
    };
  };
}


// Apply head of state's stack action on state
// Returns new state
function popStateStack(aState: State) {
  const aAction = head(aState.stack);
  return aAction(aState);
}

export { Action, State, Funct, popStateStack, actionGame, actionFunct};

