// John Conway Game of Life in 3D Cube with Noise Walkers
// John Conway Game of Life in 3D Cube with Custom Noise Walkers
let colorsArray = [], cnt, cnvs, customColors = [];
let cellSize = 12;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let slider;
let rotationX = Math.PI / 6;
let rotationY = Math.PI / 4;
let rotationZ = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let isDragging = false;
let inertiaX = 0;
let inertiaY = 0;
let noiseWalkers = [];
let autoRotation = true;
let time = 0;

// Custom noise function (simplified Perlin noise alternative)
function customNoise(x, y, z = 0) {
  // Simple hash-based noise function
  function fract(x) { return x - Math.floor(x); }
  function mix(a, b, t) { return a * (1 - t) + b * t; }

  let ix = Math.floor(x);
  let iy = Math.floor(y);
  let iz = Math.floor(z);

  let fx = fract(x);
  let fy = fract(y);
  let fz = fract(z);

  // Simple interpolation
  let n000 = hash(ix, iy, iz);
  let n100 = hash(ix + 1, iy, iz);
  let n010 = hash(ix, iy + 1, iz);
  let n110 = hash(ix + 1, iy + 1, iz);
  let n001 = hash(ix, iy, iz + 1);
  let n101 = hash(ix + 1, iy, iz + 1);
  let n011 = hash(ix, iy + 1, iz + 1);
  let n111 = hash(ix + 1, iy + 1, iz + 1);

  // Tri-linear interpolation
  let nx00 = mix(n000, n100, fx);
  let nx10 = mix(n010, n110, fx);
  let nx01 = mix(n001, n101, fx);
  let nx11 = mix(n011, n111, fx);

  let nxy0 = mix(nx00, nx10, fy);
  let nxy1 = mix(nx01, nx11, fy);

  return mix(nxy0, nxy1, fz);
}

function hash(x, y, z) {
  // Simple hash function
  let seed = x * 374761393 + y * 668265263 + z * 1103515245;
  seed = (seed ^ (seed >> 13)) * 1274126177;
  return (seed ^ (seed >> 16)) * 0.5 + 0.5; // Returns 0-1
}

function preload() {
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

  slider = createSlider(1, 60, 15, 1);
  slider.position(100, 220);
  slider.size(220);

  columnCount = 18;
  rowCount = 18;

  // Initialize cell arrays with proper centering
  for (let column = 0; column < columnCount; column++) {
    currentCells[column] = [];
    nextCells[column] = [];
    for (let row = 0; row < rowCount; row++) {
      currentCells[column][row] = 0;
      nextCells[column][row] = 0;
    }
  }

  // Initialize with a proper pattern instead of random
  initializePattern();
  assignColors();

  rotationX = Math.PI / 6;
  rotationY = Math.PI / 4;
  rotationZ = 0;

  initNoiseWalkers();
}

function initializePattern() {
  // Clear the board
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      currentCells[column][row] = 0;
    }
  }

  // Create a glider pattern in the center of each face
  const centerCol = Math.floor(columnCount / 2);
  const centerRow = Math.floor(rowCount / 2);

  // Center glider
  currentCells[centerCol][centerRow] = 1;
  currentCells[centerCol + 1][centerRow] = 1;
  currentCells[centerCol + 2][centerRow] = 1;
  currentCells[centerCol + 2][centerRow - 1] = 1;
  currentCells[centerCol + 1][centerRow - 2] = 1;
}

// Replace the entire initNoiseWalkers function with this:
function initNoiseWalkers() {
  noiseWalkers = [];
  const gridSize = (columnCount - 1) * (cellSize * 1.3);
  const startX = -gridSize / 2;
  const startY = -gridSize / 2;

  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      if (currentCells[column][row] === 1) {
        let colorIndex = (column + row) % colorsArray.length;

        noiseWalkers.push({
          baseX: startX + column * (cellSize * 1.3),
          baseY: startY + row * (cellSize * 1.3),
          baseZ: 0,
          offsetX: 0,
          offsetY: 0,
          offsetZ: 0,
          noiseScale: 0.03,
          noiseSpeed: 0.05,
          noiseSeed: Math.random() * 1000,
          amplitude: 15,
          color: colorsArray[colorIndex],
          phase: Math.random() * Math.PI * 2,
          alive: true,
          age: 0
        });
      }
    }
  }
}

function draw() {
  time += 0.01;
  let rv = slider.value();
  frameRate(rv);

  frc = frameCount;
  if (select('#framecount')) {
    select('#framecount').html('<h2> ' + frc + ' </h2>');
  }

  generate();

  applyAutoRotation();

  updateNoiseWalkers();

  drawClean3DScene();

  if (isDragging) {
    handleRotation();
  }
}

function applyAutoRotation() {
  if (autoRotation) {
    rotationX += 0.002;
    rotationY += 0.003;
    rotationZ += 0.001;
  }

  rotationX += inertiaX;
  rotationY += inertiaY;

  inertiaX *= 0.95;
  inertiaY *= 0.95;

  if (Math.abs(inertiaX) < 0.0001) inertiaX = 0;
  if (Math.abs(inertiaY) < 0.0001) inertiaY = 0;
}

// Replace the updateNoiseWalkers function with this:
function updateNoiseWalkers() {
  // Sync walkers with current cell states
  let walkerIndex = 0;

  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      if (currentCells[column][row] === 1) {
        const gridSize = (columnCount - 1) * (cellSize * 1.3);
        const startX = -gridSize / 2;
        const startY = -gridSize / 2;

        if (walkerIndex >= noiseWalkers.length) {
          // Create new walker for new alive cell
          let colorIndex = (column + row) % colorsArray.length;
          noiseWalkers.push({
            baseX: startX + column * (cellSize * 1.3),
            baseY: startY + row * (cellSize * 1.3),
            baseZ: 0,
            offsetX: 0,
            offsetY: 0,
            offsetZ: 0,
            noiseScale: 0.03,
            noiseSpeed: 0.05,
            noiseSeed: Math.random() * 1000,
            amplitude: 15,
            color: colorsArray[colorIndex],
            phase: Math.random() * Math.PI * 2,
            alive: true,
            age: 0
          });
        } else {
          // Update existing walker position and keep it alive
          noiseWalkers[walkerIndex].baseX = startX + column * (cellSize * 1.3);
          noiseWalkers[walkerIndex].baseY = startY + row * (cellSize * 1.3);
          noiseWalkers[walkerIndex].alive = true;
          noiseWalkers[walkerIndex].age++;

          // Update color if palette changed
          let colorIndex = (column + row) % colorsArray.length;
          noiseWalkers[walkerIndex].color = colorsArray[colorIndex];
        }
        walkerIndex++;
      }
    }
  }

  // Mark extra walkers as dead (for cells that died)
  for (let i = walkerIndex; i < noiseWalkers.length; i++) {
    noiseWalkers[i].alive = false;
  }

  // Update noise positions using custom noise function
  for (let walker of noiseWalkers) {
    if (walker.alive) {
      let nX = customNoise(
        time * walker.noiseSpeed + walker.noiseSeed,
        walker.noiseSeed * 0.5,
        walker.noiseSeed * 1.5
      );
      let nY = customNoise(
        time * walker.noiseSpeed + walker.noiseSeed * 2,
        walker.noiseSeed * 1.5,
        walker.noiseSeed * 2.5
      );
      let nZ = customNoise(
        time * walker.noiseSpeed + walker.noiseSeed * 3,
        walker.noiseSeed * 2.5,
        walker.noiseSeed * 3.5
      );

      walker.offsetX = (nX * 2 - 1) * walker.amplitude;
      walker.offsetY = (nY * 2 - 1) * walker.amplitude;
      walker.offsetZ = (nZ * 2 - 1) * walker.amplitude;
    } else {
      // Fade out dead walkers
      walker.offsetX *= 0.9;
      walker.offsetY *= 0.9;
      walker.offsetZ *= 0.9;
      walker.amplitude *= 0.95;
    }
  }

  // Remove dead walkers after fade out
  for (let i = noiseWalkers.length - 1; i >= 0; i--) {
    if (!noiseWalkers[i].alive && noiseWalkers[i].age > 60) {
      noiseWalkers.splice(i, 1);
    }
  }
}

function drawClean3DScene() {
  background(40);

  rotateX(rotationX);
  rotateY(rotationY);
  rotateZ(rotationZ);

  ambientLight(120);
  directionalLight(220, 220, 220, 0, 0, -1);
  directionalLight(180, 180, 180, 1, 1, 1);

  drawCenteredCube();
  drawNoiseWalkers();
}

function drawCenteredCube() {
  const cubeSize = 200;
  const faceSize = cubeSize / 2;
  const spacing = cellSize * 1.3;

  let faces = [
    { pos: [0, 0, -faceSize], rot: [0, 0, 0] },
    { pos: [0, 0, faceSize], rot: [0, Math.PI, 0] },
    { pos: [0, -faceSize, 0], rot: [-Math.PI/2, 0, 0] },
    { pos: [0, faceSize, 0], rot: [Math.PI/2, 0, 0] },
    { pos: [-faceSize, 0, 0], rot: [0, -Math.PI/2, 0] },
    { pos: [faceSize, 0, 0], rot: [0, Math.PI/2, 0] }
  ];

  for (let face of faces) {
    drawGridFace(face.pos, face.rot, cubeSize, spacing);
  }
}

function drawGridFace(pos, rot, size, spacing) {
  push();
  translate(pos[0], pos[1], pos[2]);
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
        fill(200, 200, 200, 30);
      } else {
        fill(200, 200, 200, 60);
      }

      stroke(120, 120, 120, 80);
      strokeWeight(0.4);

      box(cellSize * 0.8);

      pop();
    }
  }
  pop();
}

// And update the drawNoiseWalkers function to ensure colors are applied:
function drawNoiseWalkers() {
  push();
  noStroke();

  for (let walker of noiseWalkers) {
    if (walker.alive || walker.age > 0) {
      push();
      translate(
        walker.baseX + walker.offsetX,
        walker.baseY + walker.offsetY,
        walker.baseZ + walker.offsetZ
      );

      let alpha = walker.alive ? 200 : Math.max(0, 100 - walker.age);

      // Ensure the color is properly applied
      fill(walker.color);

      let size = cellSize * (walker.alive ? 1.0 : 0.6);
      box(size);

      pop();
    }
  }
  pop();
}

// ... (keep the handleRotation, mousePressed, mouseReleased, mouseClicked,
// windowResized, randomizeBoard, generate, countNeighbors, assignColors,
// createElts, updateColorPreview functions from previous version)

// The rest of the functions remain the same as the previous working version

function handleRotation() {
  let dx = mouseX - prevMouseX;
  let dy = mouseY - prevMouseY;

  inertiaX += dy * 0.0005;
  inertiaY += dx * 0.0005;

  rotationX += dy * 0.01;
  rotationY += dx * 0.01;

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function mousePressed() {
  isDragging = true;
  prevMouseX = mouseX;
  prevMouseY = mouseY;
  autoRotation = false;
}

function mouseReleased() {
  isDragging = false;
  setTimeout(() => { autoRotation = true; }, 2000);
}

function mouseClicked() {
  randomizeBoard();
  assignColors();
  initNoiseWalkers();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 220);
}

function randomizeBoard() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      currentCells[column][row] = Math.random() > 0.7 ? 1 : 0;
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

// Keep the assignColors function simple and working:
function assignColors() {
  // Vibrant distinct colors
  const vibrantColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9C80E', '#FFE66D',
    '#FF9A8B', '#786FA6', '#63CDDA', '#B8E994', '#82CCDD',
    '#E77C7C', '#6C5CE7', '#079992', '#FD7272', '#0C2461',
    '#FF5252', '#00CEC9', '#74B9FF', '#FFD700', '#FF7F50',
    '#9B59B6', '#1ABC9C', '#E74C3C', '#3498DB', '#F1C40F'
  ];

  // Shuffle and pick 5 colors
  let shuffled = [...vibrantColors];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  colorsArray = shuffled.slice(0, 5);
  console.log('New color palette:', colorsArray);
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

  updateColorPreview();
}

function updateColorPreview() {
  let existingPreview = select('#color-preview');
  if (existingPreview) existingPreview.remove();

  if (!colorsArray || colorsArray.length === 0) return;

  let colorPreview = createDiv('').id('color-preview').parent('#footer');
  colorPreview.position(windowWidth - 150, 60);
  colorPreview.style('display', 'flex');
  colorPreview.style('gap', '8px');
  colorPreview.style('align-items', 'center');

  for (let i = 0; i < colorsArray.length; i++) {
    let swatch = createDiv('').parent('#color-preview');
    swatch.size(18, 18);
    swatch.style('background-color', colorsArray[i]);
    swatch.style('border', '1px solid #fff');
    swatch.style('border-radius', '2px');
  }
}
