export type Point = { x: number, y: number };
export enum Cell {
    EMPTY, WALL, PATH, PATH_TAKEN
};

export class Maze {

    private _grid: Cell[][];
    private _path: Point[];
    private _pathIndex: number;
    private touchControls: boolean;

    constructor(dimension: number, touchControls: boolean) {
        this._grid = Array.from({ length: dimension }, () => Array(dimension).fill(Cell.EMPTY));
        this._path = [];
        this._pathIndex = 2;
        this.touchControls = touchControls;
        this.generate();
    }

    get grid() {
        return this._grid;
    }

    get path() {
        return this._path;
    }

    get pathIndex() {
        return this._pathIndex;
    }

    traverseByOne() {
        this._grid[this._path[this._pathIndex].x][this._path[this._pathIndex].y] = Cell.PATH_TAKEN;           
        this._pathIndex++;
    }

    traversedFully() {
        return this._pathIndex === this._path.length - 1;
    }

    generate() {
        this._grid.forEach(row => row.fill(Cell.EMPTY));
        this._path.length = 0;
        this._pathIndex = 2;

        let visited: boolean[][] = Array.from({ length: this._grid.length }, () => Array(this._grid.length).fill(false));
        let current: Point = { x: 1, y: this._grid.length - 2 }; //account for the outer walls

        //prevent from generating on timer area
        if (!this.touchControls) {
            for (let x = 15; x < 22; x++) {
                for (let y = 17; y < 20; y++) {
                    visited[x][y] = true;
                }
            }
        }
        this._grid[current.x][current.y + 1] = Cell.PATH_TAKEN;
        this._path.push({ x: current.x, y: current.y + 1 });
        this._grid[current.x][current.y] = Cell.PATH_TAKEN;
        while (current.x !== this._grid[0].length - 2 || current.y !== 1) {
            let neighbors = this.getEmptyNeighbors(current, this._grid, visited);
            if (neighbors.length > 0) {
                let randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

                this._grid[randomNeighbor.x][randomNeighbor.y] = Cell.PATH;

                //Fill square in between
                this._path.push(current);
                if (randomNeighbor.x > current.x) {
                    this._grid[current.x + 1][current.y] = Cell.PATH;
                    this._path.push({ x: current.x + 1, y: current.y });
                }
                else if (randomNeighbor.x < current.x) {
                    this._grid[current.x - 1][current.y] = Cell.PATH;
                    this._path.push({ x: current.x - 1, y: current.y })
                }
                else if (randomNeighbor.y > current.y) {
                    this._grid[current.x][current.y + 1] = Cell.PATH;
                    this._path.push({ x: current.x, y: current.y + 1 });
                }
                else if (randomNeighbor.y < current.y) {
                    this._grid[current.x][current.y - 1] = Cell.PATH;
                    this._path.push({ x: current.x, y: current.y - 1 });
                }

                current = randomNeighbor;
                visited[randomNeighbor.x][randomNeighbor.y] = true;
            } else { //no pathway, so backtrack
                //empty current
                this._grid[current.x][current.y] = Cell.EMPTY;

                let previous = this._path.pop()!;
                this._grid[previous.x][previous.y] = Cell.EMPTY;

                current = this._path.pop()!;
            }
        }
        this._path.push(current);
        this._grid[current.x + 1][current.y] = Cell.PATH;
        this._path.push({ x: current.x + 1, y: current.y });
        this._grid[current.x + 1][current.y - 1] = Cell.WALL; //hacky
        this._grid[current.x + 1][current.y + 1] = Cell.WALL; //hacky

        for (let i = 1; i < this._path.length - 1; i++) {
            this.surroundWithWalls(this._path[i], this._grid);
        }
    }

    private surroundWithWalls(current: Point, grid: Cell[][]): void {
        if (grid[current.x + 1][current.y] === Cell.EMPTY) {
            grid[current.x + 1][current.y] = Cell.WALL;
            grid[current.x + 1][current.y + 1] = Cell.WALL;
            grid[current.x + 1][current.y - 1] = Cell.WALL;
        }
        if (grid[current.x - 1][current.y] === Cell.EMPTY) {
            grid[current.x - 1][current.y] = Cell.WALL;
            grid[current.x - 1][current.y + 1] = Cell.WALL;
            grid[current.x - 1][current.y - 1] = Cell.WALL;
        }
        if (grid[current.x][current.y + 1] === Cell.EMPTY) {
            grid[current.x][current.y + 1] = Cell.WALL;
        }
        if (grid[current.x][current.y - 1] === Cell.EMPTY) {
            grid[current.x][current.y - 1] = Cell.WALL;
        }
    }

    private getEmptyNeighbors(current: Point, grid: Cell[][], visited: boolean[][]) {
        let neighbors: Point[] = [];

        //Add twice to bias the path towards the top right
        if (current.x < grid.length - 2 && grid[current.x + 2][current.y] === Cell.EMPTY && !visited[current.x + 2][current.y]) {
            neighbors.push({ x: current.x + 2, y: current.y });
            neighbors.push({ x: current.x + 2, y: current.y });
        }
        if (current.y > 1 && grid[current.x][current.y - 2] === Cell.EMPTY && !visited[current.x][current.y - 2]) {
            neighbors.push({ x: current.x, y: current.y - 2 });
            neighbors.push({ x: current.x, y: current.y - 2 });
        }

        if (current.x > 1 && grid[current.x - 2][current.y] === Cell.EMPTY && !visited[current.x - 2][current.y]) {
            neighbors.push({ x: current.x - 2, y: current.y });
        }
        if (current.y < grid[current.x].length - 2 && grid[current.x][current.y + 2] === Cell.EMPTY && !visited[current.x][current.y + 2]) {
            neighbors.push({ x: current.x, y: current.y + 2 });
        }

        return neighbors;
    }

}