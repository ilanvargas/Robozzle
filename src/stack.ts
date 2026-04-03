
// Definition of an stack an the base of a non empty stack
type PointedPair<T, U> = {
    head: T,
    cdr: U,
    size: number
};
type Stack<T> = {size: number} | { head: T, cdr: Stack<T>, size: number };

// Empty stack implementation
const nil = {size: 0};

// Push an element into a stack
// ARGS:
// - aCar:  Element to push into stack
// - aCdr:  The stack witch the element will be added
// RETURN: A new stack composed of the aCrd with aCar pushed over
// PRECOND: aCdr is the same type as the stack type (all aCdr elements are the same type)
// POSTCOND: aCdr will not be modified
function cons<T>(aCar: T, aCdr: Stack<T>): Stack<T> {
    return { head: aCar, cdr: aCdr, size: aCdr.size+1 };
}

// Returns true if aStack is empty
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

// Returns size fo stack
function stackSize<T>(aStack: Stack<T>): number {
  return aStack.size;
}

export { Stack, nil, cons, stackIsEmpty, head, tail, stackSize };
