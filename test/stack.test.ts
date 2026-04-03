import * as S from "../src/stack.js";

describe('Stack test suite', () => {

    test('Empty stack should be empty', () => {
        const s = S.nil;
        expect(S.stackIsEmpty(s)).toBe(true);
    });

    test('Non-empty stack should not be empty', () => {
        const s = S.cons(1, S.nil);
        expect(S.stackIsEmpty(s)).toBe(false);
    });
    
    test('Size of empty stack', () => {
        const s = S.nil;
        expect(S.stackSize(s)).toBe(0);
    });

    test('Size of non-empty stack', () => {
        const s = S.cons(1, S.nil);
        expect(S.stackSize(s)).toBe(1);
    });

    test('Test the head of a stack', () => {
        const s = S.cons(1, S.nil);
        expect(S.head(s)).toBe(1)
    });
});
 

