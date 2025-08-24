// John Conway Game of Life in 3D Cube with Multiple Colors
let colorsArray = [], cnt, cnvs, customColors = [];
let cellSize = 15;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let slider;
let rotationX = 0;
let rotationY = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let isDragging = false;
let footprintTrails = [];
let trailTexture;

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

  randomizeBoard();
  assignColors(); // Get initial 5 random colors

  rotationX = PI / 6;
  rotationY = PI / 4;
}

function draw() {
  let rv = slider.value();
  frameRate(rv);

  frc = frameCount;
  select('#framecount').html('<h2> ' + frc + ' </h2>');

  generate();

  // Update footprint trails
  updateFootprintTrails();

  // Draw the clean 3D scene
  drawClean3DScene();

  handleRotation();
}

function updateFootprintTrails() {
  trailTexture.push();
  trailTexture.clear();
  trailTexture.background(40, 10);
  trailTexture.translate(0, 0, -500);
  trailTexture.tint(255, 20);
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

  // Clean minimal lighting
  ambientLight(100);
  directionalLight(200, 200, 200, 0, 0, -1);
  directionalLight(150, 150, 150, 1, 1, 1);

  // Draw the compact cube
  drawCompactCube();

  // Draw footprint trails
  drawFootprintTrails();
}

function drawCompactCube() {
  const cubeSize = 180;
  const faceSize = cubeSize / 2;

  let faces = [
    { pos: [0, 0, -faceSize], rot: [0, 0, 0] },
    { pos: [0, 0, faceSize], rot: [0, PI, 0] },
    { pos: [0, -faceSize, 0], rot: [-PI/2, 0, 0] },
    { pos: [0, faceSize, 0], rot: [PI/2, 0, 0] },
    { pos: [-faceSize, 0, 0], rot: [0, -PI/2, 0] },
    { pos: [faceSize, 0, 0], rot: [0, PI/2, 0] }
  ];

  for (let face of faces) {
    drawColorfulFace(face.pos, face.rot, cubeSize);
  }
}

function drawColorfulFace(pos, rot, size) {
  push();
  translate(...pos);
  rotateX(rot[0]);
  rotateY(rot[1]);
  rotateZ(rot[2]);

  const halfSize = size / 2;
  const startX = -halfSize + cellSize/2;
  const startY = -halfSize + cellSize/2;

  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      let cell = currentCells[column][row];

      push();
      translate(
        startX + column * cellSize,
        startY + row * cellSize,
        0
      );

      if (cell === 1) {
        // Live cell - use one of the 5 assigned colors
        let colorIndex = (column + row) % colorsArray.length;
        fill(colorsArray[colorIndex]);
      } else {
        // Dead cell - transparent light gray
        fill(200, 200, 200, 80); // Light gray with transparency
      }

      // Hairline outline for all cubicles
      stroke(100, 100, 100, 100); // Subtle gray outline
      strokeWeight(0.5);

      box(cellSize * 0.85);

      pop();
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

    addRotationFootprints();

    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }
}

function addRotationFootprints() {
  // Create footprint trails from cubicles during rotation
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      if (currentCells[column][row] === 1 && random() > 0.95) {
        let colorIndex = (column + row) % colorsArray.length;
        footprintTrails.push({
          x: map(column, 0, columnCount, -100, 100),
          y: map(row, 0, rowCount, -100, 100),
          z: 0,
          size: cellSize * 0.4,
          color: color(colorsArray[colorIndex]),
          life: 30,
          rotationX: rotationX,
          rotationY: rotationY
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
  for (let footprint of footprintTrails) {
    push();
    rotateX(footprint.rotationX);
    rotateY(footprint.rotationY);
    translate(footprint.x, footprint.y, footprint.z);

    let alpha = map(footprint.life, 0, 30, 0, 150);
    let footprintColor = footprint.color;
    footprintColor.setAlpha(alpha);
    fill(footprintColor);

    box(footprint.size);
    pop();
  }
  pop();
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
  assignColors(); // Get 5 new random colors on click
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

  // Get 5 unique random colors from the custom palette
  let availableIndices = [...Array(customColors.length).keys()];

  for (let i = 0; i < 5; i++) {
    if (availableIndices.length === 0) break;

    let randomIndex = floor(random(availableIndices.length));
    let colorIndex = availableIndices[randomIndex];

    colorsArray.push(customColors[colorIndex]);
    availableIndices.splice(randomIndex, 1); // Remove to avoid duplicates
  }

  console.log('Assigned colors:', colorsArray);
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
  let colorPreview = createDiv('').parent('#footer');
  colorPreview.position(windowWidth - 150, 60);
  colorPreview.style('display', 'flex');
  colorPreview.style('gap', '5px');

  // Initial color preview
  updateColorPreview();
}

function updateColorPreview() {
  // Remove existing preview if any
  let existingPreview = select('#color-preview');
  if (existingPreview) existingPreview.remove();

  let colorPreview = createDiv('').id('color-preview').parent('#footer');
  colorPreview.position(windowWidth - 150, 60);
  colorPreview.style('display', 'flex');
  colorPreview.style('gap', '5px');

  // Create color swatches
  for (let color of colorsArray) {
    let swatch = createDiv('').parent('#color-preview');
    swatch.size(15, 15);
    swatch.style('background-color', color);
    swatch.style('border', '1px solid #fff');
  }
}
