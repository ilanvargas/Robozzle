import * as st from "~src/stack";

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
    test('Extraction head of nil should raise an error', () => {
        expect(st.head(st.nil)).toThrow();
    });

    test('Test the tail of a stack', () => {
        const s = st.cons(1, st.nil);
        expect(st.tail(s)).toBe(st.nil);
    });
    test('Extraction tail of nil should raise an error', () => {
        expect(st.tail(st.nil)).toThrow();
    });

});
 

