import { Color, Pos } from "../src/puzzle.js";
import * as sq from "../src/square.js";
// import { Color, Pos } from "./src/puzzle.js";

describe('Square test suite', () => {
    test('if square is out of the board', () => {
        const square1 = sq.out;
        expect(sq.squareIsOut(square1)).toBe(true);
    });

    test('if square is not out of the board', () => {
        const square2 = {color: Color.BLUE, isStar: false};
        expect(sq.squareIsOut(square2)).toBe(false);
    });

    test('if square is star', () => {
        const square2 = {color: Color.BLUE, isStar: true};
        expect(sq.squareIsStar(square2)).toBe(true);
    });

    test('color of the square', () => {
        const square2 = {color: Color.BLUE, isStar: true};
        expect(sq.squareColor(square2)).toBe(Color.BLUE);
    });

    test('position of the square', () => {
        const square2 = {color: Color.BLUE, isStar: true, position: {x: 0, y: 0}};
        expect(sq.squarePos(square2).x).toBe(0);
        expect(sq.squarePos(square2).y).toBe(0);
    });


});
