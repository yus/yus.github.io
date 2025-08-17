delete window.DeviceOrientationEvent;
delete window.DeviceMotionEvent;

let isPlaying = true;
let grid;
const colorManager = new ColorManager();
let colorMode = 'pair'; // Can be 'pair', 'palette', or 'full'

function toggleColorMode() {
  const modes = ['pair', 'palette', 'full'];
  colorMode = modes[(modes.indexOf(colorMode) + 1) % modes.length];
  grid.colorStrategy = grid.createColorStrategy(colorMode);
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight - 100);
  canvas.position(0, 50);

  pixelDensity(1);
  frameRate(30);

  // Initialize grid and UI
  const cellSize = 50;
  const cols = floor(windowWidth / cellSize);
  const rows = floor((windowHeight - 100) / cellSize);
  grid = new Grid(cols, rows, cellSize, colorMode);
  grid.randomize();

  setupUI();
}

function draw() {
  background(0);
  if (isPlaying) {
    grid.computeNextGeneration();
  }
  grid.draw();

  // Debug check
  console.log('Frame:', frameCount, 'Playing:', isPlaying);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 100);
  const cellSize = 10;
  const cols = floor(windowWidth / cellSize);
  const rows = floor((windowHeight - 100) / cellSize);
  grid = new Grid(cols, rows, cellSize);
}
