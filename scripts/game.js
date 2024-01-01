import { drawMenu, animatePath, animateGridDraw, drawTimer, animateGridClear, clearDisplay, drawScore } from "./modules/graphics.js";
import { PATH_TAKEN, generatePath } from "./modules/grid.js";

let game;
let pathIndex;
let status = "menu";

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
    } else if (status === "menu") {
        drawMenu();
    }

    window.requestAnimationFrame(gameLoop);
}
window.requestAnimationFrame(gameLoop);

function startGame() {
    score = 0;
    drawScore(score);
    startRound();
}

function startRound() {
    game = generatePath();
    pathIndex = 1;
    timerLengthSeconds = game.path.length / (10 + score);
    clearDisplay();
    status = "starting";
}

function winRound() {
    status = "switching";
    score++;
    drawScore(score);
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

document.getElementById('game').addEventListener('click', e => {
    if (status === "menu") {
        startGame();
    }
})

document.getElementById('game').addEventListener('mousemove', e => {
    if (status === "running") {
        let gridX = e.offsetX / e.target.width * game.grid.length;
        let gridY = e.offsetY / e.target.height * game.grid.length;
        if (Math.abs(game.path[pathIndex].x - gridX) < 0.95 && Math.abs(game.path[pathIndex].y - gridY) < 0.95) {
           traversePath();
        }
    }
})