import { animatePath, drawGrid, drawTimer } from "./modules/graphics.js";
import { PATH_TAKEN, generatePath } from "./modules/grid.js";

const {grid, path} = generatePath();
let pathIndex = 0;
let status = "waiting";

let gameTimerId;
let gameStartTime;
let timerLengthSeconds = path.length / 10;

drawGrid(grid);

function gameLoop(timestamp) {
    if (status === "started") { //TODO get around if statement
        animatePath(timestamp, path, pathIndex);
        drawTimer(timerLengthSeconds - ((Date.now() - gameStartTime) / 1000));
    }
    window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);

function start() {
    status = "started";
    
    gameStartTime = Date.now();
    gameTimerId = setTimeout(lose, timerLengthSeconds * 1000);
}

function win() {
    status = "ended";
    console.log("win");
    clearTimeout(gameTimerId);
}

function lose() {
    status = "ended";
    console.log("lost");
}

function traversePath() {
    grid[path[pathIndex].x][path[pathIndex].y] = PATH_TAKEN;
    
    if (pathIndex === 0) {
        start();
    } else if (pathIndex === path.length - 1) {
        win();
        return;
    }
    pathIndex++;
}

document.querySelector('canvas').addEventListener('mousemove', e => {
    let gridX = e.offsetX / e.target.width * grid.length;
    let gridY = e.offsetY / e.target.height * grid.length;
    if (Math.abs(path[pathIndex].x - gridX) < 0.85 && Math.abs(path[pathIndex].y - gridY) < 0.85 && status !== "ended") {
       traversePath();
    }
})