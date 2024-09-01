import { playEndSound, playMazeMusic, playMenuMusic, playStartSound, playSwitchSound, playTraverseSound, stopMazeMusic, stopMenuMusic } from "./sounds";
import { Maze } from "./maze";
import { Graphics } from "./graphics";

type Status = 'menu' | 'starting' | 'running' | 'start_switch' | 'end_switch' | 'losing';

export class Game {
    private graphics: Graphics;
    private status: Status;
    private maze: Maze;

    private score = 0;
    private setElementScore;
    private submitScore;

    private timerLengthSeconds: number = 0;
    private mazeTimerId: number = 0;
    private mazeStartTime: number = Date.now();
    private touchControls: boolean;

    constructor(graphics: Graphics, dimension: number, setElementScore: (score: number) => void, submitScore: (score: number) => void, touchControls: boolean) {
        this.status = 'menu';
        this.maze = new Maze(dimension, touchControls);
        this.graphics = graphics;
        this.graphics.drawMenu();

        this.touchControls = touchControls;

        this.setElementScore = setElementScore;
        this.submitScore = submitScore;
        playMenuMusic();
    }

    private gameLoop = (timestamp: number) => {
        if (this.status === 'running') {
            this.graphics.animatePath(timestamp, this.maze.path, this.maze.pathIndex);
            this.graphics.drawTimer(this.timerLengthSeconds - ((Date.now() - this.mazeStartTime) / 1000));
        } else if (this.status === 'starting') {
            this.graphics.beginGridAnimation();
            this.graphics.animateGridDraw(timestamp, this.maze.grid, 15)
            if (this.graphics.gridAnimationFinished()) {
                this.status = 'running';
                this.mazeStartTime = Date.now();
                this.mazeTimerId = window.setTimeout(() => this.loseGame(), this.timerLengthSeconds * 1000);
                playMazeMusic();
            }
        } else if (this.status === 'losing') {
            this.graphics.beginGridAnimation();
            this.graphics.animateGridClear(timestamp, 25)
            if (this.graphics.gridAnimationFinished()) {
                this.status = 'menu';
                this.graphics.drawMenu();
                playMenuMusic();
            }
        } else if (this.status === 'start_switch') {
            this.graphics.beginGridAnimation();
            this.graphics.animateGridClear(timestamp, 5);
            if (this.graphics.gridAnimationFinished()) {
                this.startMaze();
                this.status = 'end_switch';
            }
        } else if (this.status === 'end_switch') {
            this.graphics.beginGridAnimation();
            this.graphics.animateGridDraw(timestamp, this.maze.grid, 5)
            if (this.graphics.gridAnimationFinished()) {
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
        this.maze.generate()
        this.timerLengthSeconds = this.maze.path.length / (6 + (this.score / 2));
        this.graphics.clearDisplay();
    }

    onMazeFinish = () => {
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
        this.maze.traverseByOne();
        //disable sound for now (laggy on IOS)
        if (this.maze.pathIndex % 2 === 0 && !this.touchControls) {
            playTraverseSound();
        }

        if (this.maze.traversedFully()) {
            this.onMazeFinish();
        }
    }

    private lastPointerX = 0;
    private lastPointerY = 0;

    handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (this.status === 'running') {
            const canvas = this.graphics.getCanvas();
            let gridX = (e.nativeEvent.offsetX / canvas.width * this.maze.grid.length) * window.devicePixelRatio;
            let gridY = (e.nativeEvent.offsetY / canvas.height * this.maze.grid.length) * window.devicePixelRatio;

            const deltaX = gridX - this.lastPointerX;
            const deltaY = gridY - this.lastPointerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const steps = Math.ceil(distance); // Number of points to check
            for (let i = 0; i <= steps; i++) {
                const interpolatedX = this.lastPointerX + (deltaX / steps) * i;
                const interpolatedY = this.lastPointerY + (deltaY / steps) * i;

                if (Math.abs(this.maze.path[this.maze.pathIndex].x + 0.5 - interpolatedX) < 1.6 &&
                    Math.abs(this.maze.path[this.maze.pathIndex].y + 0.5 - interpolatedY) < 1.6) {
                    this.traversePath();
                }
            }

            this.lastPointerX = gridX;
            this.lastPointerY = gridY;
        }
    }

    handleClick = () => {
        if (this.status === 'menu') {
            this.startGame();
        }
    }
}
