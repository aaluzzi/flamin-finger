import { PATH_TAKEN, WALL} from "./grid.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

export function drawGrid(grid) {
    const SQUARE_SIZE = canvas.width / grid.length;
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