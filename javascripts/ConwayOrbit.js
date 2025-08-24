// John Conway Game of Life in 3D Cube with Inertial Orbiting
let colorsArray = [], cnt, cnvs, customColors = [];
let cellSize = 12; // Smaller cubicles
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let slider;
let rotationX = PI / 6;
let rotationY = PI / 4;
let rotationZ = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let isDragging = false;
let inertiaX = 0;
let inertiaY = 0;
let footprintTrails = [];
let trailTexture;
let autoRotation = true;

function preload() {
  // Extended custom color palette (50 colors)
  customColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9C80E', '#FF6B6B',
    '#4ECDC4', '#45B7D1', '#F9C80E', '#FF6B6B', '#4ECDC4',
    '#FFE66D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9C80E',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9C80E', '#FF6B6B',
    '#FF9A8B', '#FF6B9D', '#C44569', '#F78FB3', '#CF6A87',
    '#574B90', '#786FA6', '#546DE5', '#63CDDA', '#596275',
    '#E77C7C', '#D2527F', '#B33771', '#6C5CE7', '#A29BFE',
    '#FD7272', '#9AECDB', '#D6A2E8', '#82589F', '#2C2C54',
    '#B8E994', '#78E08F', '#38ADA9', '#079992', '#0A3D62',
    '#82CCDD', '#60A3BC', '#3C6382', '#0C2461', '#1E3799'
  ];
}

function setup() {
  createElts();

  cnvs = createCanvas(windowWidth, windowHeight - 220, WEBGL);
  cnvs.parent(cnt).position(0, 120);

  // Create trail texture for footprints
  trailTexture = createGraphics(width, height, WEBGL);
  trailTexture.background(40, 5);

  slider = createSlider(1, 60, 15, 1);
  slider.position(100, 220);
  slider.size(220);

  columnCount = 18; // Adjusted for better spacing
  rowCount = 18;

  // Initialize cell arrays
  for (let column = 0; column < columnCount; column++) {
    currentCells[column] = [];
    nextCells[column] = [];
    for (let row = 0; row < rowCount; row++) {
      currentCells[column][row] = 0;
      nextCells[column][row] = 0;
    }
  }

  randomizeBoard();
  assignColors(); // Get initial 5 random colors

  // Initial auto rotation
  rotationX = PI / 6;
  rotationY = PI / 4;
  rotationZ = 0;
}

function draw() {
  let rv = slider.value();
  frameRate(rv);

  frc = frameCount;
  select('#framecount').html('<h2> ' + frc + ' </h2>');

  generate();

  // Apply auto rotation with inertia
  applyAutoRotation();

  // Update footprint trails
  updateFootprintTrails();

  // Draw the clean 3D scene
  drawClean3DScene();

  // Handle mouse rotation if dragging
  if (isDragging) {
    handleRotation();
  }
}

function applyAutoRotation() {
  if (autoRotation) {
    // Gentle automatic rotation
    rotationX += 0.002;
    rotationY += 0.003;
    rotationZ += 0.001;
  }

  // Apply inertia
  rotationX += inertiaX;
  rotationY += inertiaY;

  // Gradually reduce inertia
  inertiaX *= 0.95;
  inertiaY *= 0.95;

  // Stop inertia when very small
  if (abs(inertiaX) < 0.0001) inertiaX = 0;
  if (abs(inertiaY) < 0.0001) inertiaY = 0;
}

function updateFootprintTrails() {
  trailTexture.push();
  trailTexture.clear();
  trailTexture.background(40, 8);
  trailTexture.translate(0, 0, -500);
  trailTexture.tint(255, 15);
  trailTexture.image(cnvs, -width/2, -height/2, width, height);
  trailTexture.pop();
}

function drawClean3DScene() {
  background(40);

  // Apply footprint trails as subtle background
  push();
  texture(trailTexture);
  noStroke();
  translate(0, 0, -800);
  plane(width * 2.5, height * 2.5);
  pop();

  // Main cube rotation
  rotateX(rotationX);
  rotateY(rotationY);
  rotateZ(rotationZ);

  // Clean minimal lighting
  ambientLight(120);
  directionalLight(220, 220, 220, 0, 0, -1);
  directionalLight(180, 180, 180, 1, 1, 1);

  // Draw the compact cube
  drawCenteredCube();
}

function drawCenteredCube() {
  const cubeSize = 200;
  const faceSize = cubeSize / 2;
  const spacing = cellSize * 1.3; // More spacing between cubicles

  let faces = [
    { pos: [0, 0, -faceSize], rot: [0, 0, 0], normal: [0, 0, -1] },       // Front
    { pos: [0, 0, faceSize], rot: [0, PI, 0], normal: [0, 0, 1] },        // Back
    { pos: [0, -faceSize, 0], rot: [-PI/2, 0, 0], normal: [0, -1, 0] },   // Top
    { pos: [0, faceSize, 0], rot: [PI/2, 0, 0], normal: [0, 1, 0] },      // Bottom
    { pos: [-faceSize, 0, 0], rot: [0, -PI/2, 0], normal: [-1, 0, 0] },   // Left
    { pos: [faceSize, 0, 0], rot: [0, PI/2, 0], normal: [1, 0, 0] }       // Right
  ];

  for (let face of faces) {
    drawCenteredFace(face.pos, face.rot, face.normal, cubeSize, spacing);
  }
}

function drawCenteredFace(pos, rot, normal, size, spacing) {
  push();
  translate(...pos);
  rotateX(rot[0]);
  rotateY(rot[1]);
  rotateZ(rot[2]);

  const gridSize = (columnCount - 1) * spacing;
  const startX = -gridSize / 2;
  const startY = -gridSize / 2;

  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      let cell = currentCells[column][row];

      push();
      translate(
        startX + column * spacing,
        startY + row * spacing,
        0
      );

      if (cell === 1) {
        // Live cell - use one of the 5 assigned colors
        let colorIndex = (column + row) % colorsArray.length;
        fill(colorsArray[colorIndex]);
      } else {
        // Dead cell - transparent light gray
        fill(200, 200, 200, 60);
      }

      // Hairline outline for all cubicles
      stroke(120, 120, 120, 80);
      strokeWeight(0.4);

      box(cellSize * 0.8); // Smaller boxes

      pop();
    }
  }
  pop();
}

function handleRotation() {
  let dx = mouseX - prevMouseX;
  let dy = mouseY - prevMouseY;

  // Add to inertia
  inertiaX += dy * 0.0005;
  inertiaY += dx * 0.0005;

  // Immediate rotation while dragging
  rotationX += dy * 0.01;
  rotationY += dx * 0.01;

  // Add footprint trails during rotation
  if (frameCount % 2 === 0) {
    addRotationFootprints();
  }

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function addRotationFootprints() {
  // Only add footprints from visible front-facing cells
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      if (currentCells[column][row] === 1 && random() > 0.7) {
        let colorIndex = (column + row) % colorsArray.length;
        footprintTrails.push({
          x: map(column, 0, columnCount, -100, 100) + random(-5, 5),
          y: map(row, 0, rowCount, -100, 100) + random(-5, 5),
          z: random(-20, 20),
          size: cellSize * 0.3,
          color: color(colorsArray[colorIndex]),
          life: random(20, 40),
          rotationX: rotationX,
          rotationY: rotationY,
          rotationZ: rotationZ
        });
      }
    }
  }

  // Update and remove old footprints
  for (let i = footprintTrails.length - 1; i >= 0; i--) {
    footprintTrails[i].life--;
    if (footprintTrails[i].life <= 0) {
      footprintTrails.splice(i, 1);
    }
  }
}

function drawFootprintTrails() {
  push();
  noStroke();
  blendMode(ADD);

  for (let footprint of footprintTrails) {
    push();
    rotateX(footprint.rotationX);
    rotateY(footprint.rotationY);
    rotateZ(footprint.rotationZ);
    translate(footprint.x, footprint.y, footprint.z);

    let alpha = map(footprint.life, 0, 40, 0, 120);
    let footprintColor = footprint.color;
    footprintColor.setAlpha(alpha);
    fill(footprintColor);

    box(footprint.size);
    pop();
  }

  blendMode(BLEND);
  pop();
}

function mousePressed() {
  isDragging = true;
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  autoRotation = false; // Pause auto rotation when user interacts
}

function mouseReleased() {
  isDragging = false;
  // Auto rotation will resume after a delay
  setTimeout(() => { autoRotation = true; }, 3000);
}

function mouseClicked() {
  randomizeBoard();
  assignColors();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 220);
  trailTexture = createGraphics(width, height, WEBGL);
  trailTexture.background(40, 5);
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

      if (currentCells[column][row] === 1) {
        nextCells[column][row] = (neighbours === 2 || neighbours === 3) ? 1 : 0;
      } else {
        nextCells[column][row] = (neighbours === 3) ? 1 : 0;
      }
    }
  }

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

function assignColors() {
  colorsArray = [];

  if (customColors.length >= 5) {
    // Get 5 unique random colors
    let shuffled = shuffle(customColors.slice(), true);
    colorsArray = shuffled.slice(0, 5);
  } else {
    // Fallback if not enough colors
    colorsArray = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F9C80E', '#FFE66D'];
  }

  console.log('Assigned colors:', colorsArray);
  updateColorPreview();
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
  frc.style('font-family', 'monospace');

  let rlgh = createA('https://github.com/', 'GITHUB').parent('#footer');
  rlgh.position(72, 29);
  rlgh.style('color', 'white');
  rlgh.style('font-family', 'monospace');

  let rl5 = createA('https://processing.org', 'PROCESSING').parent('#footer');
  rl5.position(200, 29);
  rl5.style('color', 'white');
  rl5.style('font-family', 'monospace');

  let instructions = createDiv('DRAG TO ROTATE • CLICK FOR NEW COLORS').parent('#footer');
  instructions.position(windowWidth - 350, 29);
  instructions.style('color', 'white');
  instructions.style('font-family', 'monospace');

  // Add color palette preview
  updateColorPreview();
}

function updateColorPreview() {
  let existingPreview = select('#color-preview');
  if (existingPreview) existingPreview.remove();

  let colorPreview = createDiv('').id('color-preview').parent('#footer');
  colorPreview.position(windowWidth - 150, 60);
  colorPreview.style('display', 'flex');
  colorPreview.style('gap', '8px');
  colorPreview.style('align-items', 'center');

  // Create color swatches
  for (let i = 0; i < colorsArray.length; i++) {
    let swatch = createDiv('').parent('#color-preview');
    swatch.size(18, 18);
    swatch.style('background-color', colorsArray[i]);
    swatch.style('border', '1px solid #fff');
    swatch.style('border-radius', '2px');
  }
}
