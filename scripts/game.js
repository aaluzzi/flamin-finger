import { drawMenu, animatePath, animateGridDraw, drawTimer, animateGridClear, clearDisplay, drawScore } from "./modules/graphics.js";
import { PATH_TAKEN, generatePath } from "./modules/grid.js";
import { playMenuMusic, stopMenuMusic, playMazeMusic, stopMazeMusic, playTraverseSound, playEndSound, playStartSound} from "./modules/sounds.js";

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
            if (score === 0) {
                playMazeMusic();
            }
        }
    } else if (status === "running") {
        animatePath(timestamp, game.path, pathIndex);
        drawTimer(timerLengthSeconds - ((Date.now() - gameStartTime) / 1000));
    } else if (status === "losing") {
        if (!animateGridClear(timestamp)) {
            status = "menu";
            playMenuMusic();
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
playMenuMusic();

function startGame() {
    stopMenuMusic();
    playStartSound();
    score = 0;
    drawScore(score);
    startRound();
}

function startRound() {
    game = generatePath();
    pathIndex = 2;
    timerLengthSeconds = game.path.length / (4 + score);
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
    stopMazeMusic();
    playEndSound();
}

function traversePath() {
    game.grid[game.path[pathIndex].x][game.path[pathIndex].y] = PATH_TAKEN;
    if (pathIndex % 2 === 0) {
        playTraverseSound();
    }

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
        let gridX = (e.offsetX / e.target.width * game.grid.length);
        let gridY = (e.offsetY / e.target.height * game.grid.length);
        if (Math.abs(game.path[pathIndex].x + 0.5 - gridX) < 1.25 && Math.abs(game.path[pathIndex].y + 0.5 - gridY) < 1.25) {
           traversePath();
        }
    }
})