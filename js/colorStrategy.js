class PairContrastStrategy extends ColorStrategy {
  constructor(aliveColor, deadColor) {
    super();
    this.aliveColor = aliveColor;
    this.deadColor = deadColor;
  }

  display(cell) {
    fill(cell.state ? this.aliveColor : this.deadColor);
    rect(cell.x * cell.size, cell.y * cell.size, cell.size, cell.size);
  }
}

class PaletteStrategy extends ColorStrategy {
  constructor(palette) {
    super();
    this.palette = palette; // Array of 5 colors
  }

  display(cell) {
    if (cell.state) {
      // Alive cells use palette gradient based on age/neighbors
      const age = frameCount % 100; // Example dynamic property
      const colorIndex = floor(map(age, 0, 100, 0, this.palette.length-1));
      fill(this.palette[colorIndex]);
    } else {
      // Dead cells use darkest palette color
      fill(this.palette[this.palette.length-1]);
    }
    rect(cell.x * cell.size, cell.y * cell.size, cell.size, cell.size);
  }
}

class FullSpectrumStrategy extends ColorStrategy {
  constructor(allColors) {
    super();
    this.allColors = allColors; // Array of 225 colors (45 palettes × 5)
  }

  display(cell) {
    if (cell.state) {
      // Dynamic color based on cell position and time
      const dynamicIndex = (cell.x + cell.y + frameCount) % this.allColors.length;
      fill(this.allColors[dynamicIndex]);
    } else {
      fill(0); // Black background
    }
    rect(cell.x * cell.size, cell.y * cell.size, cell.size, cell.size);
  }
}
