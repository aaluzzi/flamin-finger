import { PATH_TAKEN, PATH, WALL, generatePath } from "./modules/grid.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const {grid, path} = generatePath();
let pathIndex = 0;
let status = "ended";

const SQUARE_SIZE = canvas.width / grid.length;

let run = function() {
    drawGrid(grid);
}

let gameIntervalId;

gameIntervalId = setInterval(run, 1000 / 120);

function traversePath() {
    grid[path[pathIndex].x][path[pathIndex].y] = PATH_TAKEN;
    
    if (pathIndex === 0) {
        status = "started";
    } else if (pathIndex === path.length - 1) {
        status = "ended";
        console.log("win");
        return;
    }
    pathIndex++;
}

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
    let gridX = e.offsetX / canvas.width * grid.length;
    let gridY = e.offsetY / canvas.height * grid.length;
    if (Math.abs(path[pathIndex].x - gridX) < 1 && Math.abs(path[pathIndex].y - gridY) < 1) {
       traversePath();
    }
})