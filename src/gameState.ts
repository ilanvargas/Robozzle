import { Stack, cons, isEmpty, head, tail } from "./stack";
import { Board } from "./board";
import { Robot, Game } from "./robot";

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
type Funct = Array<Action>

// Transforms an action on the game to an action on the game state
function actionGame(funGame: (g: Game) => Game): Action {
  return (aState: State) => {
    const stackNew = tail(aState.stack);
    const gNew = funGame({ robot: aState.robot, board: aState.board });

    return {
      robot: gNew.robot,
      board: gNew.board,
      stack: stackNew
    };
  };
}
