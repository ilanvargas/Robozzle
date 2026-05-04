import * as st from "~src/stack";

describe('Tests on cons', () => {
    const s = {head: 1, cdr: st.nil, nb: 1};
    const s1 = st.cons(2, s) as { head: number, cdr: typeof s, nb: number };;
    test('Stack head is pushed element', () => {
        expect(s1.head).toBe(2);
    });
    test('Stack cdr points to old stack', () => {
        expect(s1.cdr).toBe(s);
        const t = st.cons(1, st.nil) as { head: number, cdr: typeof s, nb: number };;
        expect(t.cdr).toBe(st.nil);
    });
    test('cons does not change nb', () => {
        expect(s1.nb).toBe(s.nb);
    });
});

describe('Tests on stackIsEmpty', () => {
    test('Empty stack should be empty', () => {
        const s = st.nil;
        expect(st.stackIsEmpty(s)).toBe(true);
    });
    test('Non-empty stack should not be empty', () => {
        const s = st.cons(1, st.nil);
        expect(st.stackIsEmpty(s)).toBe(false);
    });
    test('Only nil is empty stack', () => {
        const s = {nb: 0};
        expect(st.stackIsEmpty(s)).toBe(false);
    });
});

describe('Tests on head', () => {
    test('head of a stack', () => {
        const s = st.cons(1, st.nil);
        expect(st.head(s)).toBe(1);
    });
});

describe('Tests on tail', () => {
    test('tail of a stack', () => {
        const s = st.cons(1, st.cons(2, st.nil));
        const s1 = st.cons(1, s);
        expect(st.tail(s1)).toBe(s);
    });
});

describe('Tests on call', () => {
    test('Add one to nb', () => {
        const s1 = st.call(10, st.cons(2, st.nil));
        expect(s1.nb).toBe(1);
        const s2 = st.call(10, s1);
        expect(s2.nb).toBe(2);
        const s3 = st.call(20, s2);
        expect(s3.nb).toBe(3);
    });
});

describe('Tests on isOverStack', () => {
    test('If n <= 50 then false', () => {
      const s = { head: 1, cdr: st.nil, nb: 30 };
      expect(st.isOverStack(s)).toBe(false);
      const s1 = { head: 1, cdr: st.cons(1, st.nil), nb: 50 };
      expect(st.isOverStack(s1)).toBe(false);
    });
    test('If n > 50 then false', () => {
      const s = { head: 1, cdr: st.nil, nb: 51 };
      expect(st.isOverStack(s)).toBe(true);
      const s1 = { head: 1, cdr: st.cons(1, st.nil), nb: 100 };
      expect(st.isOverStack(s1)).toBe(true);
    });
});

