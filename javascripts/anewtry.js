// John Conway Game of Life
let clr, folor, cnt, cnvs, tinges = [];
let cellSize = 25;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let font;
let slider;
let fontLoaded = false;

function preload() {
  // Load font with error handling
  font = loadFont('stylesheets/fonts/FiraCode-Light.otf',
    function() {
      console.log('Font loaded successfully');
      fontLoaded = true;
    },
    function(err) {
      console.error('Error loading font:', err);
      fontLoaded = false;
    }
  );

  // Create default colors immediately
  createDefaultColors();
}

function createDefaultColors() {
  // Create a default color palette
  tinges = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9C80E', '#FF6B6B',
    '#4ECDC4', '#45B7D1', '#F9C80E', '#FF6B6B', '#4ECDC4',
    '#FFE66D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9C80E',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9C80E', '#FF6B6B'
  ];
  console.log('Using default color palette');
}

function setup() {
  console.log('Setup started');

  createElts();

  cnvs = createCanvas(windowWidth, windowHeight-220, WEBGL);
  cnvs.parent(cnt).position(0, 120).background(52);

  // Create a slider and place it at the top of the canvas.
  slider = createSlider(1, 60, 25, 1);
  slider.position(100, 220);
  slider.size(220);

  // Calculate columns and rows
  columnCount = floor(width / cellSize);
  rowCount = floor(height / cellSize);

  // Initialize cell arrays
  for (let column = 0; column < columnCount; column++) {
    currentCells[column] = [];
    nextCells[column] = [];
    for (let row = 0; row < rowCount; row++) {
      currentCells[column][row] = 0;
      nextCells[column][row] = 0;
    }
  }

  // Initialize the board with random values
  randomizeBoard();
  colors();

  console.log('Setup completed');
  // Start the draw loop
  loop();
}

function draw() {
  // Set the framerate using the slider.
  let rv = slider.value();
  frameRate(rv);

  // Only try to use font if it's loaded
  if (fontLoaded) {
    textFont(font);
  }
  textSize(24);

  frc = frameCount;
  select('#framecount').html('<h2> ' + frc + ' </h2>');

  // Update and draw the game
  generate();

  // Draw the cells
  background(52);
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Get cell value (0 or 1)
      let cell = currentCells[column][row];

      push();
      translate(
        column * cellSize - width/2 + cellSize/2,
        row * cellSize - height/2 + cellSize/2,
        0
      );

      if (cell) {
        fill(clr);
      } else {
        fill(folor);
      }

      noStroke();
      box(cellSize * 0.8);
      pop();
    }
  }

  // Draw some info text
  push();
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(16);
  text('Frame Rate: ' + rv, 20, 20);
  text('Cells: ' + columnCount + 'x' + rowCount, 20, 40);
  text('Click to reset', 20, 60);
  pop();
}

// Reset board when mouse is pressed
function mousePressed() {
  randomizeBoard();
  colors();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight-220);
  // Recalculate columns and rows
  columnCount = floor(width / cellSize);
  rowCount = floor(height / cellSize);

  // Reinitialize cell arrays
  currentCells = [];
  nextCells = [];
  for (let column = 0; column < columnCount; column++) {
    currentCells[column] = [];
    nextCells[column] = [];
    for (let row = 0; row < rowCount; row++) {
      currentCells[column][row] = 0;
      nextCells[column][row] = 0;
    }
  }

  randomizeBoard();
}

// Fill board randomly
function randomizeBoard() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Randomly select value of either 0 (dead) or 1 (alive)
      // Keep edges dead
      if (column === 0 || row === 0 || column === columnCount-1 || row === rowCount-1) {
        currentCells[column][row] = 0;
      } else {
        currentCells[column][row] = random([0, 1]);
      }
      nextCells[column][row] = 0;
    }
  }
}

// Create a new generation
function generate() {
  // Loop through every spot in our 2D array and count living neighbors
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Skip edges (keep them dead)
      if (column === 0 || row === 0 || column === columnCount-1 || row === rowCount-1) {
        nextCells[column][row] = 0;
        continue;
      }

      // Count living neighbors surrounding current cell
      let neighbours = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue; // Skip the cell itself
          let x = (column + i + columnCount) % columnCount;
          let y = (row + j + rowCount) % rowCount;
          neighbours += currentCells[x][y];
        }
      }

      // Rules of Life
      if (currentCells[column][row] === 1) {
        // Cell is alive
        if (neighbours < 2 || neighbours > 3) {
          nextCells[column][row] = 0; // Dies
        } else {
          nextCells[column][row] = 1; // Lives
        }
      } else {
        // Cell is dead
        if (neighbours === 3) {
          nextCells[column][row] = 1; // Born
        } else {
          nextCells[column][row] = 0; // Stays dead
        }
      }
    }
  }

  // Swap the current and next arrays for next generation
  let temp = currentCells;
  currentCells = nextCells;
  nextCells = temp;
}

function colors() {
  // Make sure tinges has values before shuffling
  if (tinges && tinges.length > 0) {
    shuffle(tinges, true);
    let q = floor(random(tinges.length));
    let qf = floor(random(tinges.length));
    clr = tinges[q];
    folor = tinges[qf];
  } else {
    // Fallback colors if tinges is empty
    clr = '#FF6B6B';
    folor = '#4ECDC4';
  }
}

function createElts() {
  select('body').style('margin', '0').style('overflow', 'hidden');

  cnt = createDiv('').size(windowWidth, windowHeight);
  cnt.style('background', '#222');

  let hdr = createDiv('').id('header').parent(cnt);
  select('#header').size(windowWidth, 120).position(0, 0);

  let ftr = createDiv('').id('footer').parent(cnt);
  select('#footer').size(windowWidth, 100).position(0, windowHeight - 100);

  // Create simple text elements
  let logo = createDiv('CONWAY\'S GAME OF LIFE').parent('#header');
  logo.position(72, 29);
  logo.style('color', 'white');
  logo.style('font-size', '24px');
  logo.style('font-family', 'monospace');

  frc = createDiv('0').id('framecount');
  frc.parent('#header');
  frc.position(288, 29);
  frc.style('color', 'white');
  frc.style('font-size', '24px');
  frc.style('font-family', 'monospace');

  let rlgh = createA('https://github.com/', 'GITHUB').parent('#footer');
  rlgh.position(72, 29);
  rlgh.style('color', 'white');
  rlgh.style('font-family', 'monospace');

  let rl5 = createA('https://processing.org', 'PROCESSING').parent('#footer');
  rl5.position(200, 29);
  rl5.style('color', 'white');
  rl5.style('font-family', 'monospace');

  // Add instructions
  let instructions = createDiv('CLICK TO RESET').parent('#footer');
  instructions.position(windowWidth - 200, 29);
  instructions.style('color', 'white');
  instructions.style('font-family', 'monospace');
}
