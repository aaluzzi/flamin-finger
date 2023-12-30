import { PATH_TAKEN, WALL} from "./grid.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const SQUARE_SIZE = canvas.width / 37;

const clockFont = new FontFace('Clock', 'url(../resources/clock.ttf)');

clockFont.load().then(font => document.fonts.add(font));

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

let offset = 0;
let lastShiftTime = 0;
export function animatePath(timestamp, path, pathIndex) {
    for (let i = 0; i <= pathIndex; i++) {
        ctx.clearRect(path[i].x * SQUARE_SIZE, path[i].y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
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
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(SQUARE_SIZE * gridX + SQUARE_SIZE / 2, SQUARE_SIZE * gridY + SQUARE_SIZE / 2, SQUARE_SIZE / 4, 0, 2 * Math.PI);
    ctx.fill();
}

export function drawTimer(timeLeft) {
    ctx.clearRect(SQUARE_SIZE * 15, SQUARE_SIZE * 17, SQUARE_SIZE * 7, SQUARE_SIZE * 3);
    const scaledSize = canvas.height / 11;
    ctx.font = `${scaledSize}px Clock`;
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(timeLeft.toFixed(1).padStart(4, '0'), canvas.width / 2, canvas.height / 2);
}