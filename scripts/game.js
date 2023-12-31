import { animatePath, animateGridDraw, drawTimer, animateGridClear } from "./modules/graphics.js";
import { PATH_TAKEN, generatePath } from "./modules/grid.js";

const {grid, path} = generatePath();
let pathIndex = 1;
let status = "starting";

let gameTimerId;
let gameStartTime;
let timerLengthSeconds = path.length / 10;

function gameLoop(timestamp) {
    if (status === "starting") {
        if (!animateGridDraw(timestamp, grid)) {
            status = "started";
            gameStartTime = Date.now();
            gameTimerId = setTimeout(lose, timerLengthSeconds * 1000);
        }
    } else if (status === "started") {
        animatePath(timestamp, path, pathIndex);
        drawTimer(timerLengthSeconds - ((Date.now() - gameStartTime) / 1000));
    } else if (status === "ending") {
        if (!animateGridClear(timestamp)) {
            status = "ended";
        }
    }

    window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);

function start() {
    status = "starting";
}

function win() {
    status = "ending";
    console.log("win");
    clearTimeout(gameTimerId);
}

function lose() {
    status = "ending";
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
    if (Math.abs(path[pathIndex].x - gridX) < 0.9 && Math.abs(path[pathIndex].y - gridY) < 0.9 && status !== "ended") {
       traversePath();
    }
})