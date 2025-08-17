class ColorManager {
  constructor() {
    this.palettes = []; // Each palette has 5 colors
    this.colorPairs = []; // Generated from palettes
    this.currentPair = 0;
    this.colorMode = 'pair'; // 'pair', 'palette', 'full'
    this.loadColors();
  }

  async loadColors() {
    try {
      const response = await fetch('colors.csv');
      const csvData = await response.text();
      this.parseCSV(csvData);

      // Generate color pairs (first and last color of each palette)
      this.colorPairs = this.palettes.map(palette => ({
        alive: palette.colors[0],
        dead: palette.colors[palette.colors.length-1]
      }));
    } catch (error) {
      console.error("Error loading colors:", error);
      // Fallback colors
      this.palettes = [{
        name: "Default",
        colors: [
          [255, 0, 0],   // alive
          [200, 0, 0],   // dead
          [150, 0, 0],
          [100, 0, 0],
          [50, 0, 0]
        ]
      }];
      this.colorPairs = this.palettes.map(p => ({
        alive: p.colors[0],
        dead: p.colors[p.colors.length-1]
      }));
    }
  }

  parseCSV(csvData) {
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    let currentPalette = null;

    for (const line of lines) {
      if (line.startsWith('Palette')) {
        if (currentPalette) this.palettes.push(currentPalette);
        currentPalette = {
          name: line.trim(),
          colors: []
        };
      } else {
        const [r, g, b] = line.split(',').map(Number);
        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
          currentPalette.colors.push([r, g, b]);
        }
      }
    }

    if (currentPalette) this.palettes.push(currentPalette);
  }

  getAliveColor() {
    return this.colorPairs[this.currentPair].alive;
  }

  getDeadColor() {
    return this.colorPairs[this.currentPair].dead;
  }

  getRandomColorFromPalette(paletteIndex) {
    const palette = this.palettes[paletteIndex];
    return palette.colors[floor(random(palette.colors.length))];
  }

  randomizeColors(mode = this.colorMode) {
    this.colorMode = mode;

    switch(this.colorMode) {
      case 'pair':
        // Random pair from existing pairs
        this.currentPair = floor(random(this.colorPairs.length));
        break;

      case 'palette':
        // Random palette, create new pair from first/last
        const palette = random(this.palettes);
        this.colorPairs = [{
          alive: palette.colors[0],
          dead: palette.colors[palette.colors.length-1]
        }];
        this.currentPair = 0;
        break;

      case 'full':
        // Random colors from all available
        const allColors = this.palettes.flatMap(p => p.colors);
        this.colorPairs = [{
          alive: random(allColors),
          dead: random(allColors)
        }];
        this.currentPair = 0;
        break;
    }
  }

  nextColorPair() {
    this.currentPair = (this.currentPair + 1) % this.colorPairs.length;
  }
}
