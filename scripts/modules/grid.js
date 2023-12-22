const ROWS = 35;
const COLS = 35;

export const EMPTY = 0;
export const WALL = 1;
export const PATH = 2;

export function generatePath() {
    let grid = Array.from({ length: ROWS * 2 + 1 }, () => Array(COLS * 2 + 1).fill(EMPTY));
    let visited = Array.from({ length: ROWS}, () => Array(COLS).fill(false));
    let current = {x: 0, y: 0};
    let path = [];

    grid[current.x * 2 + 1][current.y * 2 + 1] = PATH;

    while (current.x !== ROWS - 1 || current.y !== COLS - 1) {
        let neighbors = getEmptyNeighbors(current.x, current.y, grid, visited);
        if (neighbors.length > 0) {
            let randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    
            grid[randomNeighbor.x * 2 + 1][randomNeighbor.y * 2 + 1] = PATH;
            
            //Fill square in between
            if (randomNeighbor.x > current.x) {
                grid[randomNeighbor.x * 2][randomNeighbor.y * 2 + 1] = PATH;
            }
            if (randomNeighbor.x < current.x) {
                grid[current.x * 2][current.y * 2 + 1] = PATH;
            }
            if (randomNeighbor.y > current.y) {
                grid[randomNeighbor.x * 2 + 1][randomNeighbor.y * 2] = PATH;
            }
            if (randomNeighbor.y < current.y) {
                grid[current.x * 2 + 1][current.y * 2] = PATH;
            }
    
            path.push(current);
            current = randomNeighbor;
            visited[randomNeighbor.x][randomNeighbor.y] = true;
          
        } else {
            //empty current
            grid[current.x * 2 + 1][current.y * 2 + 1] = EMPTY;

            let previous = path.pop();

            if (previous.x > current.x) {
                grid[previous.x * 2][previous.y * 2 + 1] = EMPTY;
            }
            if (previous.x < current.x) {
                grid[current.x * 2][current.y * 2 + 1] = EMPTY;
            }
            if (previous.y > current.y) {
                grid[previous.x * 2 + 1][previous.y * 2] = EMPTY;
            }
            if (previous.y < current.y) {
                grid[current.x * 2 + 1][current.y * 2] = EMPTY;
            }

            current = previous;
        }
    }
    path.push(current);

    //Fill in walls
    for (const square of path) {
        surroundWithWalls(square.x, square.y, grid);
    }

    return grid;
}

function surroundWithWalls(x, y, grid) {
    grid[x * 2][y * 2] = WALL;
    if (grid[x * 2][y * 2 + 1] === EMPTY) {
        grid[x * 2][y * 2 + 1] = WALL;
    }
    grid[x * 2][y * 2 + 2] = WALL;

    if (grid[x * 2 + 1][y * 2] === EMPTY) {
        grid[x * 2 + 1][y * 2] = WALL;
    }

    if (grid[x * 2 + 1][y * 2 + 2] === EMPTY) {
        grid[x * 2 + 1][y * 2 + 2] = WALL;
    } 

    grid[x * 2 + 2][y * 2] = WALL;
    if (grid[x * 2 + 2][y * 2 + 1] === EMPTY) {
        grid[x * 2 + 2][y * 2 + 1] = WALL;
    }
    grid[x * 2 + 2][y * 2 + 2] = WALL;
}

function getEmptyNeighbors(x, y, grid, visited) {
    let neighbors = [];
    if (x > 0 && getSquareAt(x - 1, y, grid) === EMPTY && !visited[x - 1][y]) {
        neighbors.push({x: x - 1, y: y});
    }
    if (x < ROWS - 1 && getSquareAt(x + 1, y, grid) === EMPTY && !visited[x + 1][y]) {
        neighbors.push({x: x + 1, y: y});
    }
    if (y > 0 && getSquareAt(x, y - 1, grid) === EMPTY && !visited[x][y - 1]) {
        neighbors.push({x: x, y: y - 1});
    }
    if (y < COLS - 1 && getSquareAt(x, y + 1, grid) === EMPTY && !visited[x][y + 1]) {
        neighbors.push({x: x, y: y + 1});
    }
    return neighbors;
}

function getSquareAt(x, y, grid) {
    return grid[x * 2 + 1][y * 2 + 1];
}