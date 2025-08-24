// John Conway Game of Life in 3D Cube
let clr, folor, cnt, cnvs, tinges = [];
let cellSize = 15;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let font;
let slider;
let fontLoaded = false;
let rotationX = 0;
let rotationY = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let isDragging = false;
let feedbackTexture;

function preload() {
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
}

function setup() {
  createElts();

  cnvs = createCanvas(windowWidth, windowHeight - 220, WEBGL);
  cnvs.parent(cnt).position(0, 120);
  background(52);

  // Create feedback texture
  feedbackTexture = createGraphics(width, height, WEBGL);

  // Create a slider for speed control
  slider = createSlider(1, 60, 15, 1);
  slider.position(100, 220);
  slider.size(220);

  // Calculate columns and rows for each face (all faces same size)
  columnCount = 20;
  rowCount = 20;

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

  // Set initial rotation
  rotationX = PI / 6;
  rotationY = PI / 4;
}

function draw() {
  // Set the framerate using the slider
  let rv = slider.value();
  frameRate(rv);

  // Update frame counter
  frc = frameCount;
  select('#framecount').html('<h2> ' + frc + ' </h2>');

  // Generate next generation
  generate();

  // Apply video feedback effect
  applyFeedbackEffect();

  // Draw the 3D cube with Game of Life on each face
  draw3DCube();

  // Handle mouse rotation
  handleRotation();
}

function applyFeedbackEffect() {
  // Copy current drawing to feedback texture with transparency
  feedbackTexture.push();
  feedbackTexture.translate(0, 0, -100);
  feedbackTexture.tint(255, 230); // Slight fade effect
  feedbackTexture.image(cnvs, -width/2, -height/2, width, height);
  feedbackTexture.pop();
}

function draw3DCube() {
  background(20);

  // Apply rotation
  rotateX(rotationX);
  rotateY(rotationY);

  // Enable lights for 3D effect
  lights();
  ambientLight(100);
  directionalLight(255, 255, 255, 0, 0, -1);

  // Draw the feedback texture as background
  push();
  texture(feedbackTexture);
  noStroke();
  translate(0, 0, -500);
  plane(width * 2, height * 2);
  pop();

  const cubeSize = 200;
  const faceSize = cubeSize / 2;
  const spacing = cellSize * 1.2;

  // Draw each face of the cube
  drawFace(0, 0, -faceSize, 0, 0, 0, cubeSize); // Front face
  drawFace(0, 0, faceSize, 0, PI, 0, cubeSize);  // Back face
  drawFace(0, -faceSize, 0, -PI/2, 0, 0, cubeSize); // Top face
  drawFace(0, faceSize, 0, PI/2, 0, 0, cubeSize);   // Bottom face
  drawFace(-faceSize, 0, 0, 0, -PI/2, 0, cubeSize); // Left face
  drawFace(faceSize, 0, 0, 0, PI/2, 0, cubeSize);   // Right face
}

function drawFace(x, y, z, rotX, rotY, rotZ, size) {
  push();
  translate(x, y, z);
  rotateX(rotX);
  rotateY(rotY);
  rotateZ(rotZ);

  const halfSize = size / 2;
  const startX = -halfSize + cellSize/2;
  const startY = -halfSize + cellSize/2;

  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      let cell = currentCells[column][row];

      if (cell === 1) {
        push();
        translate(
          startX + column * cellSize,
          startY + row * cellSize,
          0
        );

        // Use different colors for different states
        if (frameCount % 120 < 60) {
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
  pop();
}

function handleRotation() {
  if (isDragging) {
    let dx = mouseX - prevMouseX;
    let dy = mouseY - prevMouseY;
    rotationY += dx * 0.01;
    rotationX += dy * 0.01;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }
}

function mousePressed() {
  isDragging = true;
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function mouseReleased() {
  isDragging = false;
}

function mouseClicked() {
  randomizeBoard();
  colors();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 220);
  feedbackTexture = createGraphics(width, height, WEBGL);
}

function randomizeBoard() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      currentCells[column][row] = random([0, 1]);
      nextCells[column][row] = 0;
    }
  }
}

function generate() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      let neighbours = countNeighbors(column, row);

      // Rules of Life
      if (currentCells[column][row] === 1) {
        nextCells[column][row] = (neighbours === 2 || neighbours === 3) ? 1 : 0;
      } else {
        nextCells[column][row] = (neighbours === 3) ? 1 : 0;
      }
    }
  }

  // Swap arrays
  let temp = currentCells;
  currentCells = nextCells;
  nextCells = temp;
}

function countNeighbors(column, row) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;

      let x = (column + i + columnCount) % columnCount;
      let y = (row + j + rowCount) % rowCount;

      count += currentCells[x][y];
    }
  }
  return count;
}

function colors() {
  if (tinges && tinges.length > 0) {
    shuffle(tinges, true);
    let q = floor(random(tinges.length));
    let qf = floor(random(tinges.length));
    clr = tinges[q];
    folor = tinges[qf];
  } else {
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

  let logo = createDiv('3D CONWAY CUBE').parent('#header');
  logo.position(72, 29);
  logo.style('color', 'white');
  logo.style('font-size', '24px');
  logo.style('font-family', 'monospace');

  frc = createDiv('0').id('framecount');
  frc.parent('#header');
  frc.position(288, 29);
  frc.style('color', 'white');
  frc.style('font-size', '24px');
  logo.style('font-family', 'monospace');

  let rlgh = createA('https://github.com/', 'GITHUB').parent('#footer');
  rlgh.position(72, 29);
  rlgh.style('color', 'white');
  rlgh.style('font-family', 'monospace');

  let rl5 = createA('https://processing.org', 'PROCESSING').parent('#footer');
  rl5.position(200, 29);
  rl5.style('color', 'white');
  rl5.style('font-family', 'monospace');

  let instructions = createDiv('DRAG TO ROTATE • CLICK TO RESET').parent('#footer');
  instructions.position(windowWidth - 300, 29);
  instructions.style('color', 'white');
  instructions.style('font-family', 'monospace');
}
