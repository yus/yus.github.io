// John Conway Game of Life
let clrtable, clr, folor, cnt, cnvs, tinges;
let columns, rows, board, next;
let frc;
let cellSize = 25;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let layer, layerTorus, layerBox, checkbox; 

function preload() {
  clrtable = loadTable('javascripts/colors.csv', 'csv', 'header');
  font = loadFont('stylesheets/fonts/FiraCode-Light.otf');
}
function setup() {
  clrtable.removeColumn(0);
  console.log(clrtable.getColumnCount());
  tinges = [];
  for (let r = 0; r < clrtable.getRowCount(); r++) {
    for (let c = 0; c < clrtable.getColumnCount(); c++) {
      tinges.push(clrtable.getString(r, c));
    }
  }
  // Set simulation framerate to 10 to avoid flickering
  //frameRate(15);
  
  createElts();
  
  cnvs = createCanvas(windowWidth-220, windowHeight-220, WEBGL);
  cnvs.center();

  checkbox = createCheckbox();
  checkbox.position(100, 100);

  textFont(font);
  textSize(72);
  text(frameCount, 288, 29);
  
  // Create an options object.
  let options = { width: 25, height: 25 };

  // Create a p5.Graphics object using WebGL mode.
  layer = createGraphics(500, 500, WEBGL);

  // Create the p5.Framebuffer objects.
  // Use options for configuration.
  layerTorus = layer.createFramebuffer(options);
  layerBox = layer.createFramebuffer(options);
  layerCube = layer.createFramebuffer(options);
  
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
  init();
}

function draw() {
  // Set the framerate using the radio button.
  let rv = slider.value();
  frameRate(rv);
  
  //select('#framecount').html('<h2> ' + frameCount + ' </h2>');
  
  // Update and draw the layers offscreen.
  let t = millis() * 0.0001;
  
  lBox();
  lTorus();
  
  generate();
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Get cell value (0 or 1)
      let cell = currentCells[column][row];

      // Choose the layer to display.
      let lp;
      if (cell) {
        lp = layerBox;
        lp.begin();
        stroke(255);
        lp.end();
        layer.image(lp, column * cellSize - 250, row * cellSize - 250);
      } else {
        lp = layerTorus;
        lp.begin();
        stroke(255);
        lp.end();
        layer.image(lp, column * cellSize - 250, row * cellSize - 250);
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
  //let mt = image(layer, 0, 0);
  
  texture(layer);
  orbitControl();

  text(frameCount, 288, 29);
  
  noStroke();
  rotateX(t);
  rotateY(t);
  box(250);
  //lc.image(layer, 0, 0);
  //filter(BLUR, 0.25, true);
}

// Reset board when mouse is pressed
function mousePressed() {
  randomizeBoard();
  loop();
}
function mouseClicked() {
  init();
}
function init() {
  colors();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1)
      board[i][j] = 0;
      // Filling the rest randomly
       else
      board[i][j] = floor(random(2));
      next[i][j] = 0;
    }
  }
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
function colors() {
  shuffle(tinges);
  let q = floor(random(tinges.length));
  let qf = floor(random(tinges.length));
  clr = tinges[q];
  folor = tinges[qf];
}
function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = floor(random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
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
  layer.fill(clr);

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
  layer.fill(folor);

  // Draw the box.
  layer.box(cellSize);

  // Start drawing to the box p5.Framebuffer.
  layerBox.end();
}
function createElts() {
  select('body').attribute('style', 'margin:0; overflow:hidden');
  cnt = createDiv('').size(windowWidth, windowHeight);
  cnt.style('background', '#222');
  // Create a slider and place it at the top of the canvas.
  slider = createSlider(1, 60, 25, 1);
  slider.position(150, 220);
  slider.size(220);
  
  let hdr = createDiv('').id('header').parent(cnt);
  select('#header').size(windowWidth, 120).position(0, 0);
  let ftr = createDiv('').id('footer').parent(cnt);
  select('#footer').size(windowWidth, 100).position(0, windowHeight - 100);
  let logo = createImg('images/yus143.png', 'yusdesign logotype');
  logo.parent('#header').position(72, 29);
  //frc = createDiv('').id('framecount');
  //frc.parent('#header').position(144, 29);
  let rlgh = createA(
    'https://github.com/',
    '<img src="images/ghmarkw.png" alt="github" height="29">'
  );
  rlgh.parent('#footer').position(72, 29);
  let rl5 = createA(
    'https://processing.org',
    '<img src="images/processing.png" alt="processing" height="19">'
  );
  rl5.parent('#footer').position(129, 45);  
}
