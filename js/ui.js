// All UI controls and interactions
let isPlaying = false;
let speedSlider;

function setupUI() {
  // Main controls
  const controls = select('#controls');

  // Play/Pause button
  const playPauseBtn = createButton('⏯ Play');
  playPauseBtn.parent(controls);
  playPauseBtn.mousePressed(togglePlay);

  // Step button
  const stepBtn = createButton('⏭ Step');
  stepBtn.parent(controls);
  stepBtn.mousePressed(step);

  // Clear button
  const clearBtn = createButton('🗑 Clear');
  clearBtn.parent(controls);
  clearBtn.mousePressed(clearGrid);

  // Randomize button
  const randomBtn = createButton('🎲 Random');
  randomBtn.parent(controls);
  randomBtn.mousePressed(randomizeGrid);

  // Color button
  const colorBtn = createButton('🎨 Colors');
  colorBtn.parent(controls);
  colorBtn.mousePressed(nextColors);

  // Footer controls
  const footer = select('#footer');

  // Speed slider
  createSpan('Speed: ').parent(footer);
  speedSlider = createSlider(1, 60, 30, 1);
  speedSlider.parent(footer);
  speedSlider.input(() => frameRate(speedSlider.value()));
}

function togglePlay() {
  isPlaying = !isPlaying;
  const btn = select('#controls button:nth-of-type(1)');
  btn.html(isPlaying ? '⏸ Pause' : '⏯ Play');
}

function step() {
  if (!isPlaying) {
    gameGrid.computeNextGeneration();
  }
}

function clearGrid() {
  gameGrid.clear();
  if (isPlaying) togglePlay();
}

function randomizeGrid() {
  gameGrid.randomize();
}

function nextColors() {
  colorManager.nextColorPair();
}

// Mouse interaction
function mouseDragged() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    const i = floor(mouseX / gameGrid.cellSize);
    const j = floor(mouseY / gameGrid.cellSize);
    gameGrid.grid[i][j] = 1;
  }
}
