import { drawMenu, animatePath, animateGridDraw, drawTimer, animateGridClear, clearDisplay, drawScore } from "./graphics.js";
import { PATH_TAKEN, generatePath } from "./grid.js";
import { playMenuMusic, stopMenuMusic, playMazeMusic, stopMazeMusic, playTraverseSound, playEndSound, playStartSound, playSwitchSound} from "./sounds.js";

let game;
let pathIndex;
let status;

let score;
let highscore;
let mazeTimerId;
let mazeStartTime;
let timerLengthSeconds;

export function loadGame() {
    status = 'menu';
    window.requestAnimationFrame(gameLoop);
    drawMenu();
    playMenuMusic();
}

export function setHighscore(score) {
    highscore = score;
}

function gameLoop(timestamp) {
    if (status === "starting") {
        if (!animateGridDraw(timestamp, game.grid, 15)) {
            status = "running";
            mazeStartTime = Date.now();
            mazeTimerId = setTimeout(loseGame, timerLengthSeconds * 1000);
            playMazeMusic();
        }
    } else if (status === "running") {
        animatePath(timestamp, game.path, pathIndex);
        drawTimer(timerLengthSeconds - ((Date.now() - mazeStartTime) / 1000));
    } else if (status === "losing") {
        if (!animateGridClear(timestamp, 25)) {
            status = "menu";
            drawMenu();
            playMenuMusic();
        }
    } else if (status === "start_switch") {
        if (!animateGridClear(timestamp, 5)) {
            startMaze();
            status = "end_switch";
        }
    } else if (status === "end_switch") {
        if (!animateGridDraw(timestamp, game.grid, 15)) {
            status = "running";
            mazeStartTime = Date.now();
            mazeTimerId = setTimeout(loseGame, timerLengthSeconds * 1000);
        }
    }

    window.requestAnimationFrame(gameLoop);
}

function startGame() {
    stopMenuMusic();
    playStartSound();
    score = 0;
    drawScore(score);
    startMaze();
    status = "starting";
}

function startMaze() {
    game = generatePath();
    pathIndex = 2;
    timerLengthSeconds = game.path.length / (3 + score);
    clearDisplay();
}

function finishMaze() {
    playSwitchSound();
    clearTimeout(mazeTimerId);
    status = "start_switch";
    score++;
    drawScore(score);
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
        finishMaze();
        return;
    }
    pathIndex++;
}

document.getElementById('game').addEventListener('click', e => {
    if (status === "menu") {
        startGame();
    }
});

document.getElementById('game').addEventListener('mousemove', e => {
    if (status === "running") {
        let gridX = (e.offsetX / e.target.width * game.grid.length);
        let gridY = (e.offsetY / e.target.height * game.grid.length);
        if (Math.abs(game.path[pathIndex].x + 0.5 - gridX) < 1.25 && Math.abs(game.path[pathIndex].y + 0.5 - gridY) < 1.25) {
           traversePath();
        }
    }
});

document.getElementById('game').addEventListener('contextmenu', e => e.preventDefault());