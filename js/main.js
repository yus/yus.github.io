// Global declarations (only once)
const colorManager = new ColorManager();
let gameGrid;
let isPlaying = false;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight - 100);
  canvas.position(0, 50);

  pixelDensity(1);
  noSmooth();
  frameRate(30);

  // Initialize grid and UI
  const cellSize = 10;
  const cols = floor(windowWidth / cellSize);
  const rows = floor((windowHeight - 100) / cellSize);
  gameGrid = new Grid(cols, rows, cellSize);
  gameGrid.randomize();

  setupUI();
}

function draw() {
  background(0);

  if (isPlaying) {
    gameGrid.computeNextGeneration();
  }

  gameGrid.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 100);
  const cellSize = 10;
  const cols = floor(windowWidth / cellSize);
  const rows = floor((windowHeight - 100) / cellSize);
  gameGrid = new Grid(cols, rows, cellSize);
}
