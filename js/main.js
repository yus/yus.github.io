// Main sketch file
function setup() {
  const canvas = createCanvas(windowWidth, windowHeight - 100);
  canvas.position(0, 50);

  pixelDensity(1);
  noSmooth();
  frameRate(30);

  initColors();
  initGrid();
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
  initGrid();
}
