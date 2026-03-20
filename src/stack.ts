
// Type definition
type PointedPair<T, U> = {
    head: T,
    cdr: U,
};
type Stack<T> = undefined | { head: T, cdr: Stack<T> };

// Empty empty implementation
const nil = undefined

// Create pointed pair {aHead; aCdr}
// Used to add first element aHead into aCdr stack
function cons<T, U>(aCar: T, aCdr: U) : PointedPair<T, U> {
    return { head: aCar, cdr: aCdr };
}

// Tests if stack is empty
function isEmpty<T>(aStack: Stack<T>): boolean {
    return aStack === nil;
}

// Returns head of the stack
// PRECOND: stack is not empty
function head<T>(aStack: Stack<T>): T {
    return (aStack as PointedPair<T, Stack<T>>).head;
}

// Returns tail of the stack
// PRECOND: stack is not empty
function tail<T>(aStack: Stack<T>): Stack<T> {
    return (aStack as PointedPair<T, Stack<T>>).cdr;
}

export { Stack, nil, cons, isEmpty, head, tail };
