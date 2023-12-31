import { animatePath, animateGridDraw, drawTimer, animateGridClear } from "./modules/graphics.js";
import { PATH_TAKEN, generatePath } from "./modules/grid.js";

let game;
let pathIndex;
let status = "starting";

let score;
let gameTimerId;
let gameStartTime;
let timerLengthSeconds;

function gameLoop(timestamp) {
    if (status === "starting") {
        if (!animateGridDraw(timestamp, game.grid)) {
            status = "running";
            gameStartTime = Date.now();
            gameTimerId = setTimeout(loseGame, timerLengthSeconds * 1000);
        }
    } else if (status === "running") {
        animatePath(timestamp, game.path, pathIndex);
        drawTimer(timerLengthSeconds - ((Date.now() - gameStartTime) / 1000));
    } else if (status === "losing") {
        if (!animateGridClear(timestamp)) {
            status = "menu";
        }
    } else if (status === "switching") {
        if (!animateGridClear(timestamp)) {
            startRound();
        }
    }

    window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);

startGame();

function startGame() {
    score = 0;
    startRound();
}

function startRound() {
    game = generatePath();
    pathIndex = 1;
    timerLengthSeconds = game.path.length / (10 + score);
    status = "starting";
}

function winRound() {
    status = "switching";
    score++;
    clearTimeout(gameTimerId);
}

function loseGame() {
    status = "losing";
    console.log(`Your score: ${score}`);
}

function traversePath() {
    game.grid[game.path[pathIndex].x][game.path[pathIndex].y] = PATH_TAKEN;
    
    if (pathIndex === game.path.length - 1) {
        winRound();
        return;
    }
    pathIndex++;
}

document.querySelector('canvas').addEventListener('mousemove', e => {
    let gridX = e.offsetX / e.target.width * game.grid.length;
    let gridY = e.offsetY / e.target.height * game.grid.length;
    if (Math.abs(game.path[pathIndex].x - gridX) < 0.9 && Math.abs(game.path[pathIndex].y - gridY) < 0.9 && status === "running") {
       traversePath();
    }
})