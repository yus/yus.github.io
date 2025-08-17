class Cell {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.state = 0;
    this.nextState = 0;
    this.colorStrategy = null;
  }

  display() {
    this.colorStrategy.display(this);
  }

  update(neighbors) {
    // Conway's rules implementation
    const aliveNeighbors = neighbors.filter(n => n.state === 1).length;

    if (this.state === 1) {
      this.nextState = (aliveNeighbors === 2 || aliveNeighbors === 3) ? 1 : 0;
    } else {
      this.nextState = (aliveNeighbors === 3) ? 1 : 0;
    }
  }
}

class ColorStrategy {
  display(cell) {
    throw new Error("Abstract method - implement in subclass");
  }
}
