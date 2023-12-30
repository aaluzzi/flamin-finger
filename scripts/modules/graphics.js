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
                drawCircle(SQUARE_SIZE * row + SQUARE_SIZE / 2, SQUARE_SIZE * col + SQUARE_SIZE / 2, SQUARE_SIZE / 4, "yellow");
            } else if (grid[row][col] === PATH_TAKEN) {
                drawCircle(SQUARE_SIZE * row + SQUARE_SIZE / 2, SQUARE_SIZE * col + SQUARE_SIZE / 2, SQUARE_SIZE / 4, "red");
            } 
        }
    }
}

function drawCircle(x, y, width, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, width, 0, 2 * Math.PI);
    ctx.fill();
}

export function drawTimer(timeLeft) {
    ctx.clearRect(SQUARE_SIZE * 15, SQUARE_SIZE * 17, SQUARE_SIZE * 7, SQUARE_SIZE * 3);
    ctx.font = '76px Clock';
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(timeLeft.toFixed(1).padStart(4, '0'), canvas.width / 2, canvas.height / 2);
}