// Color management system
class ColorManager {
  constructor() {
    this.colorPairs = [];
    this.loadColors();
  }

  loadColors() {
    // Replace with your CSV loading logic
    this.colorPairs = [
      { alive: [255, 0, 0], dead: [50, 0, 0] },
      { alive: [0, 255, 0], dead: [0, 50, 0] },
      { alive: [0, 0, 255], dead: [0, 0, 50] }
    ];
    this.currentPair = 0;
  }

  getAliveColor() {
    return this.colorPairs[this.currentPair].alive;
  }

  getDeadColor() {
    return this.colorPairs[this.currentPair].dead;
  }

  nextColorPair() {
    this.currentPair = (this.currentPair + 1) % this.colorPairs.length;
  }
}

let colorManager;

function initColors() {
  colorManager = new ColorManager();
}
