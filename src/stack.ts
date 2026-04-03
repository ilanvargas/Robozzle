
// Type definition
type PointedPair<T, U> = {
    head: T,
    cdr: U,
    size: number
};
type Stack<T> = {size: number} | { head: T, cdr: Stack<T>, size: number };

// Empty stack implementation
const nil = {size: 0};

// Create pointed pair {aHead; aCdr}
// Used to add first element aHead into aCdr stack
function cons<T>(aCar: T, aCdr: Stack<T>): Stack<T> {
    return { head: aCar, cdr: aCdr, size: aCdr.size+1 };
}

// Tests if stack is empty
function stackIsEmpty<T>(aStack: Stack<T>): boolean {
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

function stackSize<T>(aStack: Stack<T>): number {
  return aStack.size;
}

export { Stack, nil, cons, stackIsEmpty, head, tail, stackSize };
