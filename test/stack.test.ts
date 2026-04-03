import * as S from "#src/Atd/stack.impl.js";

describe('Stack test suite', () => {

    test('Empty stack should be empty', () => {
        const s = S.stackCreateEmpty();
        expect(S.stackIsEmpty(s)).toBe(true);
    });

    test('Raise error [0.386] [PARSE ERROR] Escape codes to resize text area are not supwhen peeking empty stack', () => {
        const s = S.stackCreateEmpty();
        expect(() => {
            S.stackPeek(s);
        }).toThrow(Error);
    });

    test('Pop/Push identity', () => {
        const s = S.stackPush(2, S.stackPush(3, S.stackPush(4, S.stackCreateEmpty())));
        expect(S.stackPop(S.stackPush(1, s)) === s).toBe(true);
    });

    test('Peeking a push stack', () => {
        const s = S.stackPush(2, S.stackPush(3, S.stackPush(4, S.stackCreateEmpty())));
        expect(S.stackPeek(S.stackPush(1, s)) === 1).toBe(true);
    });

    test('Raise error when pop an empty stack', () => {
        const s = S.stackCreateEmpty();
        expect(S.stackPop).toThrow(Error);
    });

});
 

