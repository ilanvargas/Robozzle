import { Stack, cons, head, tail } from "./stack.js";
import { Puzzle } from "./puzzle.js";
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
// The action is responsible for managing state.stack
type Action = (aState: State) => State;

// Definition of a game function: an array of actions
// IMPORTANT: For stack implementation the array is reversed
// This is done for implentation purposes; the first action becomes the head of state.stack
type Funct = Array<Action>

// Convertes an action of the robot+board into an action of the game state
// ARG: 
// - funGame:         a game function
// - cond(optionnal): a condition on robot for action application in the form of a bool function 
// Action is applied into game state if cond is true or undefined, else the new state is the
// old one with the stack poped
// RETURN: action
function actionGame(aFunGame: (g: Game) => Game, cond?: (g: Robot) => boolean): Action {
  return (aState: State) => {
    if (cond === undefined || cond(aState.robot)) {
      const gNew = aFunGame({ robot: aState.robot, board: aState.board });

      return {
        robot: gNew.robot,
        board: gNew.board,
        stack: tail(aState.stack)
      };
    } else {
      return {
        robot: aState.robot,
        board: aState.board,
        stack: tail(aState.stack)
      };
    }
  };
}

// Implements the action of calling a function
// This action will push all function's actions into state.stack
// ARG: 
// - aFunc          : a funct 
// - cond(optionnal): condition on robot
// RETURN: an action
function actionFunct(aFunc: Funct, cond?: (g: Robot) => boolean): Action {
  return (aState: State) => {
    if (cond === undefined || cond(aState.robot)) {
      const stackNew = aFunc.
        reduce((acc: Stack<Action>, curr: Action) => cons(curr, acc), 
               tail(aState.stack));

      return {
        robot: aState.robot,
        board: aState.board,
        stack: stackNew
      };
    } else {
      return {
        robot: aState.robot,
        board: aState.board,
        stack: tail(aState.stack)
      };
    }
  };
}

// Apply head of state.stack action into state
// ARG: a state
// RETURN: a state after action application
function popStateStack(aState: State): State {
  const aAction = head(aState.stack);
  return aAction(aState);
}

// Verify if the funct list is according to puzzle specifications
// ARG: puzzle and function list
// returns nothing but can raise errors
function verifyArrayFunc(aPuzzle: Puzzle, aArrayFunct: Array<Funct>): void {
  if (aArrayFunct.length !== 5)
    throw new Error('List of functions needs to be length 5');
  else 
    aPuzzle.subs.forEach((e: number, i: number) => {
      if (aArrayFunct[i].length > e) 
        throw new Error(`Function {i} is too big: {aArray[i]} size when supposed to be <{e}`);
    });
}

export { Action, State, Funct, popStateStack, actionGame, actionFunct, verifyArrayFunc };

