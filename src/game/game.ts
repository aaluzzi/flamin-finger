import { playEndSound, playMazeMusic, playMenuMusic, playStartSound, playSwitchSound, playTraverseSound, stopMazeMusic, stopMenuMusic } from "./sounds";
import { generatePath, PATH_TAKEN, Point } from "./grid";
import { Graphics } from "./graphics";

type Status = 'menu' | 'starting' | 'running' | 'start_switch' | 'end_switch' | 'losing';

export class Game {
    private graphics: Graphics;
    private status: Status;
    private grid: number[][] = [];
    private path: Point[] = [];
    private pathIndex: number = 0;

    private score = 0;
    private setElementScore;
    private submitScore;

    private timerLengthSeconds: number = 0;
    private mazeTimerId: number = 0;
    private mazeStartTime: number = Date.now();

    constructor(canvas: HTMLCanvasElement, setElementScore: (score: number) => void, submitScore: (score: number) => void) {
        this.status = 'menu';
        this.graphics = new Graphics(canvas); 
        this.graphics.drawMenu();
        this.setElementScore = setElementScore;
        this.submitScore = submitScore;
        playMenuMusic();
    }

    private gameLoop = (timestamp: number) => {
        if (this.status === 'starting') {
            if (!this.graphics.animateGridDraw(timestamp, this.grid, 15)) {
                this.status = 'running';
                this.mazeStartTime = Date.now();
                this.mazeTimerId = window.setTimeout(() => this.loseGame(), this.timerLengthSeconds * 1000);
                playMazeMusic();
            }
        } else if (this.status === 'running') {
            this.graphics.animatePath(timestamp, this.path, this.pathIndex);
            this.graphics.drawTimer(this.timerLengthSeconds - ((Date.now() - this.mazeStartTime) / 1000));
        } else if (this.status === 'losing') {
            if (!this.graphics.animateGridClear(timestamp, 25)) {
                this.status = 'menu';
                this.graphics.drawMenu();
                playMenuMusic();
            }
        } else if (this.status === 'start_switch') {
            if (!this.graphics.animateGridClear(timestamp, 5)) {
                this.startMaze();
                this.status = 'end_switch';
            }
        } else if (this.status === 'end_switch') {
            if (!this.graphics.animateGridDraw(timestamp, this.grid, 15)) {
                this.status = 'running';
                this.mazeStartTime = Date.now();
                this.mazeTimerId = window.setTimeout(() => this.loseGame(), this.timerLengthSeconds * 1000);
            }
        }

        window.requestAnimationFrame(this.gameLoop);
    }

    startGame = () => {
        window.requestAnimationFrame(this.gameLoop);
        stopMenuMusic();
        playStartSound();
        this.score = 0;
        this.setElementScore(0);
        this.startMaze();
        this.status = 'starting';
    }

    startMaze = () => {
        const game = generatePath();
        this.grid = game.grid;
        this.path = game.path;
        this.pathIndex = 2;
        this.timerLengthSeconds = game.path.length / (6 + (this.score / 2));
        this.graphics.clearDisplay();
    }

    finishMaze = () => {
        playSwitchSound();
        clearTimeout(this.mazeTimerId);
        this.status = 'start_switch';
        this.score++;
        this.setElementScore(this.score);
    }

    loseGame = () => {
        this.status = 'losing';
        stopMazeMusic();
        playEndSound();
        this.submitScore(this.score);
    }

    traversePath = () => {
        this.grid[this.path[this.pathIndex].x][this.path[this.pathIndex].y] = PATH_TAKEN;
        if (this.pathIndex % 2 === 0) {
            playTraverseSound();
        }

        if (this.pathIndex === this.path.length - 1) {
            this.finishMaze();
            return;
        }
        this.pathIndex++;
    }

    handleMouseMove = (e : React.MouseEvent<HTMLCanvasElement>) => {
        if (this.status === 'running') {
            let gridX = (e.nativeEvent.offsetX / this.graphics.getCanvas().width * this.grid.length);
            let gridY = (e.nativeEvent.offsetY / this.graphics.getCanvas().height * this.grid.length);
            if (Math.abs(this.path[this.pathIndex].x + 0.5 - gridX) < 1.6 &&
                Math.abs(this.path[this.pathIndex].y + 0.5 - gridY) < 1.6) {
                this.traversePath();
            }
        }
    }

    handleClick = () => {
        if (this.status === 'menu') {
            this.startGame();
        }
    }
}
