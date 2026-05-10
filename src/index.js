// @ts-nocheck
import * as m from "./main.ts";

// 'robots.ttf' defines 16 ad-hoc icons, using codes from \uEE00 to \uEE0F :
// 0 = robot pointing east, 1 = robot pointing south, 2 = robot pointing west,
// 3 = robot pointing north, 4 = star, 5 = disk, 6 = box, 7 = flash,
// 8 = heart, 9 = broken heart, A = lock, B = open lock, C = key,
// D = droplet, E = rocket, F = empty

const icons = {
    robotEast:   { string: '\uEE00', color: 'pink' },
    robotSouth:  { string: '\uEE01', color: 'pink' },
    robotWest:   { string: '\uEE02', color: 'pink' },
    robotNorth:  { string: '\uEE03', color: 'pink' },
    star:        { string: '\uEE04', color: 'yellow' },
    disk:        { string: '\uEE05', color: 'red' },
    box:         { string: '\uEE06', color: 'red' },
    flash:       { string: '\uEE07', color: 'red' },
    heart:       { string: '\uEE08', color: 'red' },
    heartBroken: { string: '\uEE09', color: 'red' },
    lock:        { string: '\uEE0A', color: 'red' },
    lockOpen:    { string: '\uEE0B', color: 'red' },
    key:         { string: '\uEE0C', color: 'red' },
    droplet:     { string: '\uEE0D', color: 'red' },
    rocket:      { string: '\uEE0E', color: 'red' },
    empty:       { string: '\uEE0F', color: 'red' },
};

const aPuzzle = {
    board: [ ' b   B  rRRRr   ',
             ' b   B  r       ',
             ' bbbbB  rrrrr   ',
             ' b   b  r       ',
             ' b   b  rRRRR   ',
             '                ',
             ' g   b   RRRR   ',
             ' g   b   R  R   ',
             ' G   b   R  R   ',
             ' g   b   R  R   ',
             ' ggg bBB RRRR   ',
             '                ' ],
    robot: { x: 6, y: 7, dir: 0 },
};

const robotID = "robot";

function removeRobot() {
    const rCell = document.getElementById(robotID);
    rCell.removeAttribute('id');
    rCell.removeAttribute('style');
    rCell.innerText = icons.empty.string;
}

function addRobot(aBoardID, aRobot) {
    let aBoard = document.getElementById(aBoardID)
    let aCell  = aBoard.rows[aRobot.x].cells[aRobot.y];
    let anIcon = icons[Object.keys(icons)[aRobot.dir]];
    aCell.id = robotID;
    aCell.innerText = anIcon.string;
    aCell.style.color = anIcon.color;
}

function addStar(aCell) {
    aCell.innerText = icons.star.string;
    aCell.style.color = icons.star.color
}

function fillBoard(aBoardID, aPuzzle) {
    const tbody = document.getElementById(aBoardID);
    aPuzzle.board.forEach((aLine) => {
        const newRow = tbody.insertRow();
        aLine.split('').forEach((aChar) => {
            const newCell = newRow.insertCell();
            switch (aChar) {
            case 'r': newCell.className += " red_tile"; break;
            case 'g': newCell.className += " green_tile"; break;
            case 'b': newCell.className += " blue_tile"; break;
            case 'R': newCell.className += " red_tile"; addStar(newCell); break;
            case 'G': newCell.className += " green_tile"; addStar(newCell); break;
            case 'B': newCell.className += " blue_tile"; addStar(newCell); break;
            }
        });
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function moveRobotRandomly(aBoardID) {
    removeRobot();
    addRobot(aBoardID,
             {x: getRandomInt(12),
              y: getRandomInt(16),
              dir: getRandomInt(4)});
}

function updateUI(aState, aBoardID) {
    const tbody = document.getElementById(aBoardID);
    tbody.innerHTML = '';
    fillBoard(aBoardID, aState);
    addRobot(aBoardID, aState.robot);
}

function restartUI(aBoardID) {
    m.restart();
    const initState = m.headState();
    updateUI(initState, aBoardID);
}

function stepUI(aBoardID) {
    if (m.isDone()) {
        console.log(`No more steps`);
        return;
    }
    else {
        const currState = m.step();
        updateUI(currState, aBoardID);
    }
}

function backUI(aBoardID) {
    const currState = m.back();
    updateUI(currState, aBoardID);
}

function playUI(aBoardID) {
    function play_rec() {
        if (m.isDone()) {
            console.log(`No more steps`);
            return;
        }
        else {
            const currState = m.step();
            updateUI(currState, aBoardID);

            setTimeout(play_rec, 100);
        }
    }
    
    play_rec();
}

window.onload = () => {
    const initState = m.headState();
    let aBoardID = "visualizer_board";
    fillBoard(aBoardID, initState);
    addRobot(aBoardID, initState.robot);

    document.
        getElementById("button_step").
        addEventListener("click", () => stepUI(aBoardID));
    document.
        getElementById("button_back").
        addEventListener("click", () => backUI(aBoardID));
    document.
        getElementById("button_play").
        addEventListener("click", () => playUI(aBoardID));
    document.
        getElementById("button_restart").
        addEventListener("click", () => restartUI(aBoardID));
};
