import { Stack, cons, head, tail } from "./stack.js";
import { Board } from "./board.js";
import { Robot, Game } from "./robot.js";

// Definition of a game state
// The state is defined by the board, the robot and a stack witch the actions to do
type State = {
  robot: Robot;
  board: Board;
  stack: Stack<Action>;
};

// Definition of an action
// An action is a function that takes as an argument a game state and returns a modified one
// The previous state is not modified
type Action = (aState: State) => State;

// Definition of a game function: an array of actions
// IMPORTANT: For stack implementation the array is reversed
// This is done for implentation purposes; the first action becomes the head of state.stack
// The action also manages the state.stack
type Funct = Array<Action>

// Convertes an action of the robot+board into an action of the game state
// ARG: an game function 
// RETURN: action
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

// Implements the action of calling a function
// This action will push all function's actions into state.stack
// ARG: a function
// RETURN: action
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

// Apply head of state.stack action into state
// ARG: state
// RETURN: state after action application
function popStateStack(aState: State): State {
  const aAction = head(aState.stack);
  return aAction(aState);
}

export { Action, State, Funct, popStateStack, actionGame, actionFunct};

