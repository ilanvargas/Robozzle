
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
    return aList.car as { car: T, cdr: List<T> };
}

// Returns tail of the list
// PRECOND: list is not empty
function tail<T>(aList: List<T>): List<T> {
    return aList.cdr as PointedPair<T, List<T>>;
}

// Converts list to string
// Usefull for tests
function list2String<T>(aList: List<T>): string {
  if (isEmpty(aList))
    return ""
  else
    head(aList).toString.concat(list2String(tail(aList)));
}

const l = cons(1, cons(2, cons(3, nil)));
console.log(list2String(l));

export { List, 
  nil, 
  cons, 
  isEmpty, 
  head, 
  tail,
  list2String};
