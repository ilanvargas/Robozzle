import { Color, Position, Dir } from "./puzzle"

interface Node {
    isStar : boolean;
    color : Color;
    position : Position;
    N : Node;
    S : Node;
    E : Node;
    W : Node;
}