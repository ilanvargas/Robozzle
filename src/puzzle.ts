//Enumeration of the direction
enum Dir {
    EST = 0,
    SUD,
    WEST,
    NORD,
};


//Enumeration of the Colors
enum Color {
    NO_COLOR = 0,
    BLUE,   
    GREEN,
    RED,
};


//Position of the case 
interface Position {
    x : number;
    y : number;
};

export { Dir, Color, Position };



