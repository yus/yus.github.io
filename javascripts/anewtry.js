// John Conway Game of Life
let clrtable, clr, folor, cnt, cnvs, tinges = [];
let columns, rows, board, next;
let frc;
let cellSize = 25;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let layer, layerTorus, layerBox, checkbox;
let font;
let slider;
let layerCube;

function preload() {
  // Try to load the table but handle potential errors
  try {
    clrtable = loadTable('javascripts/colors.csv', 'csv', 'header',
      function() {
        console.log('Colors table loaded successfully');
      },
      function(err) {
        console.error('Error loading colors table:', err);
        // Create default colors as fallback
        createDefaultColors();
      }
    );
  } catch (e) {
    console.error('Exception loading table:', e);
    createDefaultColors();
  }

  font = loadFont('stylesheets/fonts/FiraCode-Light.otf');
}

function createDefaultColors() {
  // Create a default color palette if CSV loading fails
  tinges = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9C80E', '#FF6B6B',
    '#4ECDC4', '#45B7D1', '#F9C80E', '#FF6B6B', '#4ECDC4',
    '#FFE66D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9C80E'
  ];
  console.log('Using default color palette');
}

function setup() {
  // Check if clrtable is loaded before using it
  if (!clrtable || !clrtable.getRowCount || clrtable.getRowCount() === 0) {
    console.log('Using fallback colors');
    if (tinges.length === 0) {
      createDefaultColors();
    }
  } else {
    try {
      // Try to remove the first column if it exists
      if (clrtable.getColumnCount() > 0) {
        clrtable.removeColumn(0);
      }
      console.log('Table columns:', clrtable.getColumnCount());

      for (let r = 0; r < clrtable.getRowCount(); r++) {
        for (let c = 0; c < clrtable.getColumnCount(); c++) {
          let colorValue = clrtable.getString(r, c);
          if (colorValue && colorValue.trim() !== '') {
            tinges.push(colorValue.trim());
          }
        }
      }
      console.log('Loaded', tinges.length, 'colors from CSV');
    } catch (e) {
      console.error('Error processing table:', e);
      if (tinges.length === 0) {
        createDefaultColors();
      }
    }
  }

  // Set simulation framerate to 10 to avoid flickering
  textFont(font);
  textSize(72);

  createElts();

  cnvs = createCanvas(windowWidth, windowHeight-220, WEBGL);
  cnvs.parent(cnt).position(0, 120).background(52);

  // Create a slider and place it at the top of the canvas.
  slider = createSlider(1, 60, 25, 1);
  slider.position(100, 220);
  slider.size(220);

  // Create an options object.
  let options = { width: 25, height: 25 };

  // Create a p5.Graphics object using WebGL mode.
  layer = createGraphics(500, 500, WEBGL);

  // Create the p5.Framebuffer objects.
  layerTorus = layer.createFramebuffer(options);
  layerBox = layer.createFramebuffer(options);
  layerCube = layer.createFramebuffer(options);

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

  // Start the draw loop
  loop();
}

function draw() {
  // Set the framerate using the slider.
  let rv = slider.value();
  frameRate(rv);

  frc = frameCount;
  select('#framecount').html('<h2> ' + frc + ' </h2>');
  select('#framecount').style('font-family', 'FiraCode-Light');

  // Update and draw the layers offscreen.
  let t = millis() * 0.0001;

  lBox();
  lTorus();

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
}

// Reset board when mouse is pressed
function mousePressed() {
  randomizeBoard();
  colors(); // Get new colors
  loop();
}

function init() {
  colors();
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
    shuffle(tinges, true); // Use p5.js built-in shuffle
    let q = floor(random(tinges.length));
    let qf = floor(random(tinges.length));
    clr = tinges[q];
    folor = tinges[qf];
  } else {
    // Fallback colors if tinges is empty
    clr = '#FF6B6B';
    folor = '#4ECDC4';
  }
  console.log('Colors:', clr, folor);
}

// Update and draw the box layer offscreen.
function lBox() {
  layerBox.begin();
  layerBox.clear();
  layerBox.background(0, 0, 0, 0); // Transparent background
  layerBox.fill(clr);
  layerBox.noStroke();
  layerBox.box(cellSize/2);
  layerBox.end();
}

// Update and draw the torus layer offscreen.
function lTorus() {
  layerTorus.begin();
  layerTorus.clear();
  layerTorus.background(0, 0, 0, 0); // Transparent background
  layerTorus.fill(folor);
  layerTorus.noStroke();
  layerTorus.box(cellSize/2);
  layerTorus.end();
}

function createElts() {
  select('body').attribute('style', 'margin:0; overflow:hidden');
  cnt = createDiv('').size(windowWidth, windowHeight);
  cnt.style('background', '#222');

  let hdr = createDiv('').id('header').parent(cnt);
  select('#header').size(windowWidth, 120).position(0, 0);
  let ftr = createDiv('').id('footer').parent(cnt);
  select('#footer').size(windowWidth, 100).position(0, windowHeight - 100);

  // Create simple text elements instead of images
  let logo = createDiv('CONWAY\'S GAME OF LIFE').parent('#header').position(72, 29);
  logo.style('color', 'white').style('font-size', '24px').style('font-family', 'monospace');

  frc = createDiv('0').id('framecount');
  frc.parent('#header').position(288, 29);
  frc.style('color', 'white').style('font-size', '24px').style('font-family', 'monospace');

  let rlgh = createA('https://github.com/', 'GITHUB').parent('#footer').position(72, 29);
  rlgh.style('color', 'white').style('font-family', 'monospace');

  let rl5 = createA('https://processing.org', 'PROCESSING').parent('#footer').position(200, 29);
  rl5.style('color', 'white').style('font-family', 'monospace');

  // Add instructions
  let instructions = createDiv('CLICK TO RESET').parent('#footer').position(windowWidth - 200, 29);
  instructions.style('color', 'white').style('font-family', 'monospace');
}
