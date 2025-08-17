class Grid {
  constructor(cols, rows, cellSize, colorStrategyType) {
    this.cells = [];
    this.colorStrategy = this.createColorStrategy(colorStrategyType);

    // Initialize cell grid
    for (let i = 0; i < cols; i++) {
      this.cells[i] = [];
      for (let j = 0; j < rows; j++) {
        this.cells[i][j] = new Cell(i, j, cellSize);
        this.cells[i][j].colorStrategy = this.colorStrategy;
      }
    }
  }

  createColorStrategy(type) {
    switch(type) {
      case 'pair':
        return new PairContrastStrategy(colorManager.getAliveColor(), colorManager.getDeadColor());
      case 'palette':
        return new PaletteStrategy(colorManager.getRandomPalette());
      case 'full':
        return new FullSpectrumStrategy(colorManager.getAllColors());
    }
  }

  display() {
    this.cells.forEach(col => col.forEach(cell => cell.display()));
  }

  update() {
    // First calculate next states
    this.cells.forEach((col, i) => {
      col.forEach((cell, j) => {
        const neighbors = this.getNeighbors(i, j);
        cell.update(neighbors);
      });
    });

    // Then update all states
    this.cells.forEach(col => col.forEach(cell => {
      cell.state = cell.nextState;
    }));
  }
}
