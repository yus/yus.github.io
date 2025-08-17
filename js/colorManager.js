class ColorManager {
  constructor() {
    this.palettes = [/* Your 45 palettes */];
    this.currentPair = 0;
  }

  getAliveColor() {
    return this.palettes[this.currentPair].colors[0];
  }

  getDeadColor() {
    return this.palettes[this.currentPair].colors[4];
  }

  getRandomPalette() {
    return random(this.palettes).colors;
  }

  getAllColors() {
    return this.palettes.flatMap(p => p.colors);
  }

  nextColorPair() {
    this.currentPair = (this.currentPair + 1) % this.palettes.length;
  }
}
