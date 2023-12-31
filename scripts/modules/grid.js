export const ROWS = 37;
export const COLS = 37;

export const EMPTY = 0;
export const WALL = 1;
export const PATH = 2;
export const PATH_TAKEN = 3;

export function generatePath() {
    let grid = Array.from({ length: ROWS}, () => Array(COLS).fill(EMPTY));
    let visited = Array.from({ length: ROWS}, () => Array(COLS).fill(false));
    let current = {x: 1, y: grid.length - 2}; //account for the outer walls
    let path = [];

    //prevent from generating on timer area
    for (let x = 15; x < 22; x++) {
        for (let y = 17; y < 20; y++) {
            visited[x][y] = true;
        }
    }

    grid[current.x][current.y] = PATH_TAKEN;

    while (current.x !== grid[0].length - 2 || current.y !== 1) {
        let neighbors = getEmptyNeighbors(current, grid, visited);
        if (neighbors.length > 0) {
            let randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    
            grid[randomNeighbor.x][randomNeighbor.y] = PATH;
            
            //Fill square in between
            path.push(current);
            if (randomNeighbor.x > current.x) {
                grid[current.x + 1][current.y] = PATH;
                path.push({x: current.x + 1, y: current.y});
            }
            else if (randomNeighbor.x < current.x) {
                grid[current.x - 1][current.y] = PATH;
                path.push({x: current.x - 1, y: current.y})
            }
            else if (randomNeighbor.y > current.y) {
                grid[current.x][current.y + 1] = PATH;
                path.push({x: current.x, y: current.y + 1});
            }
            else if (randomNeighbor.y < current.y) {
                grid[current.x][current.y - 1] = PATH;
                path.push({x: current.x, y: current.y - 1});
            }
    
            current = randomNeighbor;
            visited[randomNeighbor.x][randomNeighbor.y] = true;
        } else {
            //empty current
            grid[current.x][current.y] = EMPTY;

            let previous = path.pop();
            grid[previous.x][previous.y] = EMPTY;

            current = path.pop();
        }
    }
    path.push(current);

    //Fill in walls
    for (const square of path) {
        surroundWithWalls(square, grid);
    }

    return {grid, path};
}

function surroundWithWalls(current, grid) {
    if (grid[current.x + 1][current.y] === EMPTY) {
        grid[current.x + 1][current.y] = WALL;
        grid[current.x + 1][current.y + 1] = WALL;
        grid[current.x + 1][current.y - 1] = WALL;
    }
    if (grid[current.x - 1][current.y] === EMPTY) {
        grid[current.x - 1][current.y] = WALL;
        grid[current.x - 1][current.y + 1] = WALL;
        grid[current.x - 1][current.y - 1] = WALL;
    }
    if (grid[current.x][current.y + 1] === EMPTY) {
        grid[current.x][current.y + 1] = WALL;
    }
    if (grid[current.x][current.y - 1] === EMPTY) {
        grid[current.x][current.y - 1] = WALL;
    }
}

function getEmptyNeighbors(current, grid, visited) {
    let neighbors = [];
    if (current.x > 1 && grid[current.x - 2][current.y] === EMPTY && !visited[current.x - 2][current.y]) {
        neighbors.push({x: current.x - 2, y: current.y});
    }
    if (current.x < grid.length - 2 && grid[current.x + 2][current.y] === EMPTY && !visited[current.x + 2][current.y]) {
        neighbors.push({x: current.x + 2, y: current.y});
    }
    if (current.y > 1 && grid[current.x][current.y - 2] === EMPTY && !visited[current.x][current.y - 2]) {
        neighbors.push({x: current.x, y: current.y - 2});
    }
    if (current.y < grid[current.x].length - 2 && grid[current.x][current.y + 2] === EMPTY && !visited[current.x][current.y + 2]) {
        neighbors.push({x: current.x, y: current.y + 2});
    }
    return neighbors;
}