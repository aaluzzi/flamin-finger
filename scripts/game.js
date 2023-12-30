import { PATH_TAKEN, PATH, WALL, generatePath } from "./modules/grid.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const {grid, path} = generatePath();
let pathIndex = 0;

const SQUARE_SIZE = canvas.width / grid.length;

let run = function() {
    drawGrid(grid);
}

let gameIntervalId;

gameIntervalId = setInterval(run, 1000 / 120);

function drawGrid(grid) {

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

canvas.addEventListener('mousemove', e => {
    let gridX = Math.floor(e.offsetX / canvas.width * grid.length);
    let gridY = Math.floor(e.offsetY / canvas.height * grid.length);
    if (grid[gridX][gridY] === PATH && path[pathIndex].x === gridX && path[pathIndex].y === gridY) {
        grid[gridX][gridY] = PATH_TAKEN;
        pathIndex++;
    }
})