import { Color } from "~src/puzzle.js";
import * as sq from "~src/square.js";

describe('Square test suite', () => {
    test('if square is out of the board', () => {
        const square1 = sq.out;
        expect(sq.squareIsOut(square1)).toBe(true);
    });

    test('if square is not out of the board', () => {
        const square2 = {color: Color.BLUE, isStar: false, position: {x: 1, y: 1}};
        expect(sq.squareIsOut(square2)).toBe(false);
    });

    test('only square out triggers out of board', () => {
        const out1 = {color: Color.NOCOLOR, isStar: false, position: {x: -1, y: -1}};
        expect(sq.squareIsOut(out1)).toBe(false);
    });
});
