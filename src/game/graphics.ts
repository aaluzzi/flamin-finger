import { COLS, PATH, Point, ROWS, WALL } from './grid.js';

export class Graphics {

	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private cursorRow = ROWS - 1;
	private cursorCol = 0;
	private pathOffset = 0;
	private lastDrawTime = 0;
	private gridAnimating = false;
	private SQUARE_SIZE: number;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d')!;
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		this.SQUARE_SIZE = canvas.width / ROWS;

		const clockFont = new FontFace('Clock', 'url(/clock.ttf)');
		clockFont.load().then((font) => document.fonts.add(font));
	}

	getCanvas() {
		return this.canvas;
	}

	clearDisplay() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	beginGridAnimation() {
		this.gridAnimating = true;
	}

	gridAnimationFinished() {
		return !this.gridAnimating;
	}

	animateGridDraw(timestamp: number, grid: number[][], frameDelay: number) {
		if (timestamp - this.lastDrawTime > frameDelay) {
			this.lastDrawTime = timestamp;
			this.drawDiagonalDown(grid, this.cursorRow, this.cursorCol);
			
			if (this.cursorRow > 0) {
				this.cursorRow--;
			} else if (this.cursorCol < COLS - 1) {
				this.cursorCol++;
			} else {
				this.gridAnimating = false;
			}
		}
	}

	private drawDiagonalDown(grid: number[][], row: number, col: number) {
		while (row < ROWS && col < COLS) {
			if (grid[col][row] === WALL) {
				this.drawCircle(col, row, '#ffd500');
			}
			row++;
			col++;
		}
	}

	animateGridClear(timestamp: number, frameDelay: number) {
		if (timestamp - this.lastDrawTime > frameDelay) {
			this.lastDrawTime = timestamp;
			this.clearDiagonalDown(this.cursorRow, this.cursorCol);

			if (this.cursorCol > 0) {
				this.cursorCol--;
			} else if (this.cursorRow < COLS - 1) {
				this.cursorRow++;
			} else {
				this.gridAnimating = false;
			}
		}
	}

	private clearDiagonalDown(row: number, col: number) {
		while (row < ROWS && col < COLS) {
			this.ctx.clearRect(col * this.SQUARE_SIZE, row * this.SQUARE_SIZE, this.SQUARE_SIZE, this.SQUARE_SIZE);
			row++;
			col++;
		}
	}

	animatePath(timestamp: number, path: Point[], pathIndex: number) {
		for (let i = 0; i <= pathIndex; i++) {
			this.ctx.shadowBlur = 0;
			this.ctx.clearRect(path[i].x * this.SQUARE_SIZE, path[i].y * this.SQUARE_SIZE, this.SQUARE_SIZE, this.SQUARE_SIZE);
		}
		for (let i = this.pathOffset; i < pathIndex - 1; i += 8) {
			this.drawCircle(path[i].x, path[i].y, 'red');
			this.drawCircle(path[i + 1].x, path[i + 1].y, 'red');
		}
		//always show head position
		this.drawCircle(path[pathIndex - 1].x, path[pathIndex - 1].y, 'red');

		if (timestamp - this.lastDrawTime >= 22 - (5 * pathIndex) / path.length) {
			this.pathOffset++;
			this.pathOffset %= 8;
			this.lastDrawTime = timestamp;
		}
	}

	private drawCircle(gridX: number, gridY: number, color: string) {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.shadowOffsetX = 0;
		this.ctx.shadowOffsetY = 0;
		this.ctx.shadowBlur = this.SQUARE_SIZE / 6;
		this.ctx.shadowColor = color;
		this.ctx.arc(
			this.SQUARE_SIZE * gridX + this.SQUARE_SIZE / 2,
			this.SQUARE_SIZE * gridY + this.SQUARE_SIZE / 2,
			this.SQUARE_SIZE / 3.5,
			0,
			2 * Math.PI
		);
		this.ctx.fill();
	}

	drawTimer(timeLeft: number) {
		this.ctx.clearRect(this.SQUARE_SIZE * 15, this.SQUARE_SIZE * 17, this.SQUARE_SIZE * 7, this.SQUARE_SIZE * 3);
		const scaledSize = this.canvas.height / 11;
		this.ctx.font = `${scaledSize}px Clock`;
		this.ctx.fillStyle = 'red';
		this.ctx.textAlign = 'center';
		this.ctx.textBaseline = 'middle';
		this.ctx.fillText(timeLeft.toFixed(1).padStart(4, '0'), this.canvas.width / 2, this.canvas.height / 2);
	}

	drawMenu() {
		for (let row = 0; row < MENU_GRID.length; row++) {
			for (let col = 0; col < MENU_GRID[row].length; col++) {
				if (MENU_GRID[row][col] === WALL) {
					this.drawCircle(col, row, "yellow");
				} else if (MENU_GRID[row][col] === PATH) {
					this.drawCircle(col, row, "red");
				}
			}
		}
	}
}

const MENU_GRID = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
	[0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
	[2, 0, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 0, 2, 0],
	[2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0],
	[2, 0, 0, 2, 0, 0, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0],
	[2, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0],
	[2, 0, 0, 2, 0, 0, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 0, 2, 0],
	[0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
	[0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 1, 1, 0, 2, 2, 2, 0, 2, 0, 0, 0, 2, 2, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 2, 2, 0, 1, 1, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 1, 1, 0, 0, 2, 2, 0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 1, 1, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 1, 1, 0, 0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 1, 1, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 0, 0, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0, 0, 2, 0, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 0, 0, 1, 1, 1, 0],
	[0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 2, 0, 2, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 1, 1, 0, 0, 2, 2, 0, 0, 0, 2, 0, 0, 2, 0, 2, 2, 0, 2, 0, 2, 2, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 1, 1, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 1, 1, 1, 0, 2, 0, 0, 0, 2, 2, 2, 0, 2, 0, 0, 2, 0, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0, 1, 1, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
