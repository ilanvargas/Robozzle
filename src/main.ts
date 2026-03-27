import { isWin, Board, boardInit } from "./board.js";
import { squareColor } from "./square.js";
import { Stack, isEmpty, nil } from "./stack.js";
import { Puzzle } from "./puzzle.js";
import { State } from "./gameState.js"


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
    if (isEmpty(aState.stack)){
        return;
    }
    if (isWin(aState.board)){
        return;
    }
}


//const state = initState(aPuzzle); 


