
// Type definition
type PointedPair<T, U> = {
    car: T,
    cdr: U,
};
type List<T> = undefined | { car: T, cdr: List<T> };

// Empty list implementation
const nil = undefined

// Create pointed pair {aCar; aCdr}
// Used to add first element aCar into aCdr list
function cons<T, U>(aCar: T, aCdr: U) : PointedPair<T, U> {
    return { car: aCar, cdr: aCdr };
}

// Tests if list is empty
function isEmpty<T>(aList: List<T>): boolean {
    return aList === nil;
}

// Returns first element of list
// PRECOND: list is not empty
function head<T>(aList: List<T>): T {
    return (aList as PointedPair<T, List<T>>).car;
}

// Returns tail of the list
// PRECOND: list is not empty
function tail<T>(aList: List<T>): List<T> {
    return (aList as PointedPair<T, List<T>>).cdr;
}

// Converts list to string
// Usefull for tests
function list2String<T>(aList: List<T>): string {
  function list2StringInt<T>(aList: List<T>): string {
    if (isEmpty(aList))
      return "nil";
    else
      return `${head(aList)}, ${list2StringInt(tail(aList))}`;
  }
  return `(|${list2StringInt(aList)}|)`;
}

export { List, nil, cons, isEmpty, head, tail, list2String };
