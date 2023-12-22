import { WALL, generatePath } from "./modules/grid.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

function drawGrid(grid) {
    const SQUARE_SIZE = canvas.width / grid.length;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === WALL) {
                ctx.beginPath();
                ctx.fillStyle = "yellow";
                ctx.arc(SQUARE_SIZE * row + SQUARE_SIZE / 2, SQUARE_SIZE * col + SQUARE_SIZE / 2, SQUARE_SIZE / 4, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
}

let grid = generatePath();
drawGrid(grid);