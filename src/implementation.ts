//Characteristic of the Robot
interface Robot {
    Col : number;
    Row : number;
    Dir : number;
}

// Puzzle
interface Puzzle {
    id : number;
    title : string;
    about : string;
    robotCol : number;
    robotRow : number;
    robotDir : number;
    subs : number[];
    allowedCommands : number;
    board : string;
}

//Enumeration of the direction
enum Dir {
    EST=0,
    SUD,
    WEST,
    NORD,
    NONE,
};

// function change_dir(R : )


