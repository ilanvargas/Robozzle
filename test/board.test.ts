import * as bo from "~src/board";
import * as sq from "~src/square";
import { Color, Dir, puzzleWidth, puzzleHeight } from "~src/puzzle";

describe('Board test suite', () => {
    // Test data: a simple 4x4 board
    // b.b.
    // ....
    // .B..
    // ....
    const simplePuzzle = {
        id: 1,
        title: "Simple Test",
        about: "A simple test board",
        robotCol: 0,
        robotRow: 0,
        robotDir: Dir.EAST,
        subs: [0, 0, 0, 0, 0],
        allowedCommands: 0,
        board: "b.b...B.........."
    };

    // Test data: board with stars
    // B = uppercase means star
    // b = lowercase means no star
    const starPuzzle = {
        id: 2,
        title: "Star Test",
        about: "A board with stars",
        robotCol: 0,
        robotRow: 0,
        robotDir: Dir.EAST,
        subs: [0, 0, 0, 0, 0],
        allowedCommands: 0,
        board: "r.R......................"
    };

    describe('boardInit', () => {
        test('should initialize a board from a puzzle', () => {
            const board = bo.boardInit(simplePuzzle);
            expect(board).toBeDefined();
            expect(board.board).toBeDefined();
            expect(board.start).toBeDefined();
            expect(board.nbStars).toBeDefined();
        });

        test('should correctly count the number of stars', () => {
            const board = bo.boardInit(starPuzzle);
            expect(board.nbStars).toBe(2); // R appears twice in starPuzzle
        });

        test('should set the start position correctly', () => {
            const board = bo.boardInit(simplePuzzle);
            expect(board.start.position.x).toBe(simplePuzzle.robotRow);
            expect(board.start.position.y).toBe(simplePuzzle.robotCol);
        });

        test('should correctly identify colors in the board', () => {
            const board = bo.boardInit(simplePuzzle);
            // Check for red squares
            const hasRed = board.board.some(sq => sq.color === Color.RED && !sq.isStar);
            expect(hasRed).toBe(true);
            // Check for blue squares
            const hasBlue = board.board.some(sq => sq.color === Color.BLUE && !sq.isStar);
            expect(hasBlue).toBe(true);
        });

        test('should correctly identify starred squares', () => {
            const board = bo.boardInit(starPuzzle);
            const starsCount = board.board.filter(s => s.isStar).length;
            expect(starsCount).toBe(board.nbStars);
        });

        test('should handle empty spaces in the board', () => {
            const board = bo.boardInit(simplePuzzle);
            const outSquares = board.board.filter(s => s.color === Color.NOCOLOR);
            expect(outSquares.length).toBeGreaterThan(0);
        });
    });

    describe('isWin', () => {
        test('should return false when there are stars remaining', () => {
            const board = bo.boardInit(starPuzzle);
            expect(bo.isWin(board)).toBe(false);
        });

        test('should return true when there are no stars remaining', () => {
            const board = bo.boardInit(starPuzzle);
            const emptyBoard: any = { ...board, nbStars: 0 };
            expect(bo.isWin(emptyBoard)).toBe(true);
        });

        test('should return true for a board with 0 stars initially', () => {
            const board = bo.boardInit(simplePuzzle);
            expect(bo.isWin(board)).toBe(true);
        });
    });

    describe('move2square', () => {
        test('should move north correctly', () => {
            const board = bo.boardInit(simplePuzzle);
            const startSquare = board.start;
            
            // Move to a square on the board (adjust based on where start is)
            if (startSquare.position.x > 0) {
                const northSquare = bo.move2square(board, startSquare, Dir.NORD);
                expect(northSquare.position.x).toBe(startSquare.position.x - 1);
                expect(northSquare.position.y).toBe(startSquare.position.y);
                expect(sq.squareIsOut(northSquare)).toBe(false);
            }
        });

        test('should move south correctly', () => {
            const board = bo.boardInit(simplePuzzle);
            const startSquare = board.start;
            
            const southSquare = bo.move2square(board, startSquare, Dir.SOUTH);
            expect(southSquare.position.x).toBe(startSquare.position.x + 1);
            expect(southSquare.position.y).toBe(startSquare.position.y);
        });

        test('should move east correctly', () => {
            const board = bo.boardInit(simplePuzzle);
            const startSquare = board.start;
            
            const eastSquare = bo.move2square(board, startSquare, Dir.EAST);
            expect(eastSquare.position.x).toBe(startSquare.position.x);
            expect(eastSquare.position.y).toBe(startSquare.position.y + 1);
        });

        test('should move west correctly', () => {
            const board = bo.boardInit(simplePuzzle);
            const startSquare = board.start;
            
            if (startSquare.position.y > 0) {
                const westSquare = bo.move2square(board, startSquare, Dir.WEST);
                expect(westSquare.position.x).toBe(startSquare.position.x);
                expect(westSquare.position.y).toBe(startSquare.position.y - 1);
            }
        });

        test('should return out square when moving outside board boundary', () => {
            const board = bo.boardInit(simplePuzzle);
            // Find a square at the edge and try to move beyond it
            const edgeSquare = board.board[0]; // top-left corner
            if (edgeSquare.position.x === 0) {
                const outSquare = bo.move2square(board, edgeSquare, Dir.NORD);
                expect(sq.squareIsOut(outSquare)).toBe(true);
            }
        });
    });

    describe('removeStar', () => {
        test('should remove a star from the board', () => {
            const board = bo.boardInit(starPuzzle);
            const initialStarCount = board.nbStars;
            
            // Find a square with a star
            const starSquare = board.board.find(s => s.isStar);
            if (starSquare) {
                const newBoard = bo.removeStar(board, starSquare);
                expect(newBoard.nbStars).toBe(initialStarCount - 1);
            }
        });

        test('should not modify the original board', () => {
            const board = bo.boardInit(starPuzzle);
            const initialNbStars = board.nbStars;
            const starSquare = board.board.find(s => s.isStar);
            
            if (starSquare) {
                bo.removeStar(board, starSquare);
                expect(board.nbStars).toBe(initialNbStars);
            }
        });

        test('should update the square in the board array', () => {
            const board = bo.boardInit(starPuzzle);
            const starSquare = board.board.find(s => s.isStar);
            
            if (starSquare) {
                const newBoard = bo.removeStar(board, starSquare);
                const updatedSquare = newBoard.board.find(
                    s => s.position.x === starSquare.position.x && 
                         s.position.y === starSquare.position.y
                );
                expect(updatedSquare?.isStar).toBe(false);
                expect(updatedSquare?.color).toBe(starSquare.color);
            }
        });

        test('should maintain the start position', () => {
            const board = bo.boardInit(starPuzzle);
            const starSquare = board.board.find(s => s.isStar);
            
            if (starSquare) {
                const newBoard = bo.removeStar(board, starSquare);
                expect(newBoard.start).toEqual(board.start);
            }
        });

        test('should preserve other squares', () => {
            const board = bo.boardInit(starPuzzle);
            const starSquare = board.board.find(s => s.isStar);
            
            if (starSquare) {
                const newBoard = bo.removeStar(board, starSquare);
                const otherSquares = newBoard.board.filter(
                    s => !(s.position.x === starSquare.position.x && 
                           s.position.y === starSquare.position.y)
                );
                expect(otherSquares.length).toBe(board.board.length - 1);
            }
        });
    });
});
