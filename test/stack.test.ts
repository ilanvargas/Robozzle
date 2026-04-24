import * as st from "~src/stack.js";

describe('Stack test suite', () => {

    test('Empty stack should be empty', () => {
        const s = st.nil;
        expect(st.stackIsEmpty(s)).toBe(true);
    });

    test('Non-empty stack should not be empty', () => {
        const s = st.cons(1, st.nil);
        expect(st.stackIsEmpty(s)).toBe(false);
    });

    test('Test the head of a stack', () => {
        const s = st.cons(1, st.nil);
        expect(st.head(s)).toBe(1);
    });

    test('Test the tail of a stack', () => {
        const s = st.cons(1, st.nil);
        expect(st.tail(s)).toBe(st.nil);
    });
});
 

