import { Color, Position, Dir } from "#dist/src/puzzle.js"

interface Node {
    isStar : boolean;
    color : Color;
    position : Position;
    N : Node;
    S : Node;
    E : Node;
    W : Node;
}