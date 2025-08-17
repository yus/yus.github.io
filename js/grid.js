// Grid logic and cell management
class Grid {
  constructor(cols, rows, cellSize) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.grid = this.createEmptyGrid();
    this.nextGrid = this.createEmptyGrid();
  }

  createEmptyGrid() {
    return Array(this.cols).fill().map(() => Array(this.rows).fill(0));
  }

  randomize(density = 0.3) {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = random() < density ? 1 : 0;
      }
    }
  }

  clear() {
    this.grid = this.createEmptyGrid();
  }

  countNeighbors(x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        const col = (x + i + this.cols) % this.cols;
        const row = (y + j + this.rows) % this.rows;
        sum += this.grid[col][row];
      }
    }
    sum -= this.grid[x][y];
    return sum;
  }

  computeNextGeneration() {
    // Verify this method actually updates the grid
    let newGrid = this.createEmptyGrid();

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const neighbors = this.countNeighbors(i, j);
        const state = this.grid[i][j];

        // Conway's rules
        if (state === 0 && neighbors === 3) {
          newGrid[i][j] = 1;
        } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
          newGrid[i][j] = 0;
        } else {
          newGrid[i][j] = state;
        }
      }
    }

    this.grid = newGrid; // Critical update!
  }

  draw() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const x = i * this.cellSize;
        const y = j * this.cellSize;

        const aliveColor = colorManager.getAliveColor();
        const deadColor = colorManager.getDeadColor();

        if (this.grid[i][j] === 1) {
          fill(aliveColor[0], aliveColor[1], aliveColor[2]);
        } else {
          fill(deadColor[0], deadColor[1], deadColor[2]);
        }

        rect(x, y, this.cellSize, this.cellSize);
      }
    }
  }
}
// let gameGrid;
function initGrid() {
  const cellSize = 10;
  const cols = floor(windowWidth / cellSize);
  const rows = floor((windowHeight - 100) / cellSize); // Account for controls
  gameGrid = new Grid(cols, rows, cellSize);
  gameGrid.randomize();
}
