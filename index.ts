import { printGrid, sleep } from "./utils";

const CELL = "*";
const VOID = " ";

function inBounds(grid: string[][], row: number, col: number) {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function cellNeighborCount(grid: string[][]) {
  const rows = grid.length;
  const columns = grid[0].length;
  const neighborCount = new Array(grid.length)
    .fill(null)
    .map(() => new Array(grid[0].length).fill(0));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      directions.forEach(([x, y]) => {
        const nextRow = row + x;
        const nextCol = col + y;
        if (!inBounds(grid, nextRow, nextCol)) return;
        neighborCount[row][col] += grid[nextRow][nextCol] === CELL;
      });
    }
  }

  return neighborCount;
}

async function gameOfLife(rows: number, columns: number) {
  let iterations = 200;
  const grid: string[][] = new Array(rows)
    .fill(null)
    .map(() => new Array(columns).fill(VOID));

  let randomPoints = (rows * columns) / 10;

  while (randomPoints--) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * columns);
    grid[randomRow][randomCol] = CELL;
  }

  const history = new Set<string>();

  while (iterations--) {
    if (history.has(JSON.stringify(grid))) {
      console.log("Cycle Detected!");
      return;
    }
    history.add(JSON.stringify(grid));

    await sleep(50);
    console.clear();
    console.log("iterations left:", iterations);

    const neighborCount = cellNeighborCount(grid);
    printGrid(grid);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        if (neighborCount[row][col] < 2) grid[row][col] = VOID;
        else if (neighborCount[row][col] === 2) continue;
        else if (neighborCount[row][col] === 3) grid[row][col] = CELL;
        else if (neighborCount[row][col] === 4) grid[row][col] = VOID;
      }
    }
  }
  /*
  1. Any live cell with fewer than two live neighbors dies, as if by underpopulation.
  2. Any live cell with two or three live neighbors lives on to the next generation.
  3. Any live cell with more than three live neighbors dies, as if by overpopulation.
  4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
  */
}

gameOfLife(10, 100);
