// Processing-style alternative
let grid, colors;
let isPlaying = false;
let cellSize = 10;

function setup() {
  // Add this at the start:
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .catch(console.error);
  }
  
  createCanvas(windowWidth, windowHeight - 100);
  pixelDensity(1);
  noSmooth();

  colors = new ColorManager();
  initGrid();
  setupUI();
}

function draw() {
  background(0);

  if (isPlaying) {
    grid.computeNextGeneration();
  }

  grid.draw();
}

// Include the same class definitions from grid.js and colors.js here
// Include the same UI functions from ui.js here
