// All UI controls and interactions
// let speedSlider;
// let isPlaying;
let footer;

function setupUI() {
  // Main controls
  // Header with logo and p5.js star
  const controls = select('#controls');
  footer = select('#footer'); // Initialize here

  const headerContent = createDiv('').class('header-content').parent(controls);

  // Your logo
  const logo = createImg('images/yus143.png', 'yusdesign').class('logo').parent(headerContent);

  // Control buttons container
  const controlsContainer = createDiv('').parent(headerContent);

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

  // Add color mode buttons
  const colorModeDiv = createDiv('').style('margin-left', '20px').parent(controlsContainer);

  createSpan('Color Mode: ').parent(colorModeDiv);

  const pairBtn = createButton('Pair').parent(colorModeDiv);
  pairBtn.mousePressed(() => {
    colorManager.randomizeColors('pair');
    colorManager.nextColorPair();
  });

  const paletteBtn = createButton('Palette').parent(colorModeDiv);
  paletteBtn.mousePressed(() => {
    colorManager.randomizeColors('palette');
  });

  const fullBtn = createButton('Full Random').parent(colorModeDiv);
  fullBtn.mousePressed(() => {
    colorManager.randomizeColors('full');
  });

  // Add save button
  const saveBtn = createButton('<i class="fas fa-camera"></i> Save')
    .id('save-btn')
    .parent(controlsContainer);
  saveBtn.mousePressed(() => {
    saveCanvas('game-of-life-' + new Date().toISOString().slice(0, 10), 'png');
  });

  // Footer controls
  // Speed slider
  createSpan('Speed: ').parent(footer);
  speedSlider = createSlider(1, 60, 30, 1);
  speedSlider.parent(footer);
  speedSlider.input(() => frameRate(speedSlider.value()));

  // p5.js logo
  const p5Logo = createA('https://p5js.org', '', '_blank').parent(headerContent);
  createImg('https://p5js.org/assets/img/p5js.svg', 'p5.js logo').class('p5-logo').parent(p5Logo);

  // Footer with credits
  const footer = select('#footer');
  const footerContent = createDiv('').class('footer-content').parent(footer);
  footerContent.html('Conway\'s Game of Life by YUS | Powered by p5.js');
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

function saveCanvasImage() {
  saveCanvas('game-of-life-' + new Date().toISOString(), 'png');
}
