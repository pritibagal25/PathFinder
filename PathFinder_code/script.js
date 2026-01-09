const gridElement = document.getElementById("grid");
const rows = 20;
const cols = 20;

let grid = [];
let start = { row: 3, col: 4 };
let end = { row: rows - 5, col: cols - 10 };

// Create grid
for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (r === start.row && c === start.col) cell.classList.add("start");
        if (r === end.row && c === end.col) cell.classList.add("end");
        gridElement.appendChild(cell);
        row.push(cell);
    }
    grid.push(row);
}

// BFS Algorithm
function bfs() {
    const queue = [];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const prev = Array.from({ length: rows }, () => Array(cols).fill(null));

    queue.push(start);
    visited[start.row][start.col] = true;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function explore() {
        while (queue.length > 0) {
            const { row, col } = queue.shift();

            if (row === end.row && col === end.col) {
                reconstructPath(prev);
                return;
            }

            const directions = [
                { r: -1, c: 0 },
                { r: 1, c: 0 },
                { r: 0, c: -1 },
                { r: 0, c: 1 }
            ];

            for (const { r, c } of directions) {
                const newRow = row + r;
                const newCol = col + c;
                if (
                    newRow >= 0 && newRow < rows &&
                    newCol >= 0 && newCol < cols &&
                    !visited[newRow][newCol]
                ) {
                    queue.push({ row: newRow, col: newCol });
                    visited[newRow][newCol] = true;
                    prev[newRow][newCol] = { row, col };
                    grid[newRow][newCol].classList.add("visited");
                    await sleep(20);
                }
            }
        }
    }

    explore();
}

// Reconstruct path
function reconstructPath(prev) {
    let curr = end;
    while (curr) {
        const { row, col } = curr;
        if (!(row === start.row && col === start.col) && !(row === end.row && col === end.col)) {
            grid[row][col].classList.add("path");
        }
        curr = prev[row][col];
    }
}

document.getElementById("startBtn").addEventListener("click", bfs);
