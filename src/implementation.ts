//Characteristic of the Robot
type Robot = {
    Col : number;
    Row : number;
    Dir : number
}

// Puzzle
type Puzzle = {
    id : number;
    title : string;
    about : string;
    robotCol : number;
    robotRow : number;
    robotDir : number;
    subs : number[];
    allowedCommands : number;
    board : string
}

//Enumeration of the direction
enum Dir {
    EST,
    SUD,
    WEST,
    NORD,
    NONE
};


