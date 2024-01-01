import { COLS, PATH_TAKEN, ROWS, WALL} from "./grid.js";

const gameCanvas = document.getElementById("game");
const scoreCanvas = document.getElementById("score")
const gameCtx = gameCanvas.getContext("2d");
const scoreCtx = scoreCanvas.getContext("2d");

gameCanvas.width = gameCanvas.offsetWidth;
gameCanvas.height = gameCanvas.offsetHeight;
scoreCanvas.width = scoreCanvas.offsetWidth;
scoreCanvas.height = scoreCanvas.offsetHeight;

const SQUARE_SIZE = gameCanvas.width / ROWS;

const clockFont = new FontFace('Clock', 'url(../resources/clock.ttf)');

clockFont.load().then(font => document.fonts.add(font));

export function clearDisplay() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

export function drawGrid(grid) {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === WALL) {
                drawCircle(row, col, "yellow");
            } else if (grid[row][col] === PATH_TAKEN) {
                drawCircle(row, col, "red");
            } 
        }
    }
}

let lastShiftTime = 0;

let row = ROWS - 1;
let col = 0;
export function animateGridDraw(timestamp, grid) {
    if (timestamp - lastShiftTime > 18) {
        lastShiftTime = timestamp;

        drawDiagonalDown(grid, row, col);
        if (row > 0) {
            row--;
        } else if (col < COLS - 1) {
            col++;
        } else {
            return false; //done drawing
        }

    }
    return true;
}

function drawDiagonalDown(grid, row, col) {
    while (row < ROWS && col < COLS) {
        if (grid[col][row] === WALL) {
            drawCircle(col, row, "yellow");
        }
        row++;
        col++;
    }
}

export function animateGridClear(timestamp) {
    if (timestamp - lastShiftTime > 18) {
        lastShiftTime = timestamp;

        clearDiagonalDown(row, col);
        if (col > 0) {
            col--;
        } else if (row < COLS - 1) {
            row++;
        } else {
            return false; //done clearing
        }
    }
    return true;
}

function clearDiagonalDown(row, col) {
    while (row < ROWS && col < COLS) {
        gameCtx.clearRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        row++;
        col++;
    }
}

let offset = 0;
export function animatePath(timestamp, path, pathIndex) {
    for (let i = 0; i <= pathIndex; i++) {
        gameCtx.shadowBlur = 0;
        gameCtx.clearRect(path[i].x * SQUARE_SIZE, path[i].y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }
    for (let i = offset; i < pathIndex - 1; i += 8) {
        drawCircle(path[i].x, path[i].y, "red");
        drawCircle(path[i + 1].x, path[i + 1].y, "red");
    }
    //always show head position
    drawCircle(path[pathIndex - 1].x, path[pathIndex - 1].y, "red");

    if (timestamp - lastShiftTime >= (25 - (5 * pathIndex / path.length))) {
        offset++;
        offset %= 8;
        lastShiftTime = timestamp;
    }
}


function drawCircle(gridX, gridY, color) {
    gameCtx.beginPath();
    gameCtx.fillStyle = color;
    gameCtx.shadowOffsetX = 0;
    gameCtx.shadowOffsetY = 0;
    gameCtx.shadowBlur = SQUARE_SIZE / 4;
    gameCtx.shadowColor = color;
    gameCtx.arc(SQUARE_SIZE * gridX + SQUARE_SIZE / 2, SQUARE_SIZE * gridY + SQUARE_SIZE / 2, SQUARE_SIZE / 4, 0, 2 * Math.PI);
    gameCtx.fill();
}

export function drawTimer(timeLeft) {
    gameCtx.clearRect(SQUARE_SIZE * 15, SQUARE_SIZE * 17, SQUARE_SIZE * 7, SQUARE_SIZE * 3);
    const scaledSize = gameCanvas.height / 11;
    gameCtx.font = `${scaledSize}px Clock`;
    gameCtx.fillStyle = "red";
    gameCtx.textAlign = "center";
    gameCtx.textBaseline = "middle";
    gameCtx.fillText(timeLeft.toFixed(1).padStart(4, '0'), gameCanvas.width / 2, gameCanvas.height / 2);
}

export function drawMenu() {
    gameCtx.font = `${gameCanvas.height / 10}px monospace`;
    gameCtx.fillStyle = "red";
    gameCtx.textAlign = "center";
    gameCtx.textBaseline = "middle";
    gameCtx.shadowBlur = 0;
    gameCtx.fillText("Flamin Finger", gameCanvas.width / 2, gameCanvas.height / 2);
}

export function drawScore(score) {
    scoreCtx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height)
    scoreCtx.font = `${scoreCanvas.height * 1.25}px Clock`;
    scoreCtx.fillStyle = "red";
    scoreCtx.textAlign = "right";
    scoreCtx.textBaseline = "middle";
    scoreCtx.fillText(score, scoreCanvas.width, scoreCanvas.height / 2);
}