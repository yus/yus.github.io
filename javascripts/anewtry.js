let cellSize = 40;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let layer, layerTorus, layerBox, checkbox; 
let lp = layerBox;

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(25);
  let cnvs = createCanvas(400, 400);
  cnvs.center();

  checkbox = createCheckbox();
  checkbox.position(0, 100);
  
  // Create an options object.
  let options = { width: 40, height: 40 };

  // Create a p5.Graphics object using WebGL mode.
  layer = createGraphics(400, 400, WEBGL);

  // Create the p5.Framebuffer objects.
  // Use options for configuration.
  layerTorus = layer.createFramebuffer(options);
  layerBox = layer.createFramebuffer(options);
  
  // Calculate columns and rows
  columnCount = floor(width / cellSize);
  rowCount = floor(height / cellSize);

  // Set each column in current cells to an empty array
  // This allows cells to be added to this array
  // The index of the cell will be its row number
  for (let column = 0; column < columnCount; column++) {
    currentCells[column] = [];
  }

  // Repeat the same process for the next cells
  for (let column = 0; column < columnCount; column++) {
    nextCells[column] = [];
  }

  noLoop();
  describe(
    "Grid of squares that switch between white and black, demonstrating a simulation of John Conway's Game of Life. When clicked, the simulation resets."
  );
}

function draw() {
  // Update and draw the layers offscreen.
  lTorus();
  lBox();

  generate();
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Get cell value (0 or 1)
      let cell = currentCells[column][row];

      // Choose the layer to display.
      if (cell) {
        lp = layerBox;
        layer.image(lp, column * cellSize - 200, row * cellSize - 200);
      } else {
        lp = layerTorus;
        layer.image(lp, column * cellSize - 200, row * cellSize - 200);
      }
      // Convert cell value to get black (0) for alive or white (255 (white) for dead
      /*
      layer.fill((1 - cell) * 255);
      layer.stroke(0);
      layer.square(column * cellSize, row * cellSize, cellSize);
      */
      // layer.image(lp, column * cellSize, row * cellSize);
    }
  }
  image(layer, 0, 0);
  //filter(BLUR, 0.25, true);
}

// Reset board when mouse is pressed
function mousePressed() {
  randomizeBoard();
  loop();
}

// Fill board randomly
function randomizeBoard() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Randomly select value of either 0 (dead) or 1 (alive)
      currentCells[column][row] = random([0, 1]);
    }
  }
}

// Create a new generation
function generate() {
  // Loop through every spot in our 2D array and count living neighbors
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Column left of current cell
      // if column is at left edge, use modulus to wrap to right edge
      let left = (column - 1 + columnCount) % columnCount;

      // Column right of current cell
      // if column is at right edge, use modulus to wrap to left edge
      let right = (column + 1) % columnCount;

      // Row above current cell
      // if row is at top edge, use modulus to wrap to bottom edge
      let above = (row - 1 + rowCount) % rowCount;

      // Row below current cell
      // if row is at bottom edge, use modulus to wrap to top edge
      let below = (row + 1) % rowCount;

      // Count living neighbors surrounding current cell
      let neighbours =
        currentCells[left][above] +
        currentCells[column][above] +
        currentCells[right][above] +
        currentCells[left][row] +
        currentCells[right][row] +
        currentCells[left][below] +
        currentCells[column][below] +
        currentCells[right][below];

      // Rules of Life
      // 1. Any live cell with fewer than two live neighbours dies
      // 2. Any live cell with more than three live neighbours dies
      if (neighbours < 2 || neighbours > 3) {
        nextCells[column][row] = 0;
        // 4. Any dead cell with exactly three live neighbours will come to life.
      } else if (neighbours === 3) {
        nextCells[column][row] = 1;
        // 3. Any live cell with two or three live neighbours lives, unchanged, to the next generation.
      } else nextCells[column][row] = currentCells[column][row];
    }
  }

  // Swap the current and next arrays for next generation
  let temp = currentCells;
  currentCells = nextCells;
  nextCells = temp;
}
// Update and draw the torus layer offscreen.
function lTorus() {
  // Start drawing to the torus p5.Framebuffer.
  layerTorus.begin();

  // Clear the drawing surface.
  layer.clear();

  // Turn on the lights.
  layer.lights();

  // Rotate the coordinate system.
  layer.rotateX(frameCount * 0.01);
  layer.rotateY(frameCount * 0.01);

  // Style the torus.
  layer.noStroke(0);

  // Draw the torus.
  layer.torus(cellSize);

  // Start drawing to the torus p5.Framebuffer.
  layerTorus.end();
}

// Update and draw the box layer offscreen.
function lBox() {
  // Start drawing to the box p5.Framebuffer.
  layerBox.begin();

  // Clear the drawing surface.
  layer.clear();

  // Turn on the lights.
  layer.lights();

  // Rotate the coordinate system.
  layer.rotateX(frameCount * 0.01);
  layer.rotateY(frameCount * 0.01);

  // Style the box.
  layer.noStroke();

  // Draw the box.
  layer.box(cellSize/2);

  // Start drawing to the box p5.Framebuffer.
  layerBox.end();
}
