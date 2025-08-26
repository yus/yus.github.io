// John Conway Game of Life in 3D Cube with Noise Walkers
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
  try {
    createElts();

    cnvs = createCanvas(windowWidth, windowHeight - 220, WEBGL);
    cnvs.parent(cnt).position(0, 120);

    slider = createSlider(1, 60, 15, 1);
    slider.position(100, 220);
    slider.size(220);

    columnCount = 18;
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
    assignColors();

    rotationX = Math.PI / 6;
    rotationY = Math.PI / 4;
    rotationZ = 0;

    // Initialize noise walkers
    initNoiseWalkers();

  } catch (error) {
    console.error('Setup error:', error);
  }
}

function initNoiseWalkers() {
  noiseWalkers = [];
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      if (currentCells[column][row] === 1) {
        createNoiseWalker(column, row);
      }
    }
  }
}

function createNoiseWalker(column, row) {
  const gridSize = (columnCount - 1) * (cellSize * 1.3);
  const startX = -gridSize / 2;
  const startY = -gridSize / 2;

  let colorIndex = (column + row) % colorsArray.length;

  noiseWalkers.push({
    baseX: startX + column * (cellSize * 1.3),
    baseY: startY + row * (cellSize * 1.3),
    baseZ: 0,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    noiseScale: random(0.01, 0.05),
    noiseSpeed: random(0.02, 0.08),
    noiseSeed: random(1000),
    amplitude: random(8, 20),
    color: colorsArray[colorIndex],
    phase: random(Math.PI * 2),
    alive: true,
    age: 0
  });
}

function draw() {
  try {
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
  } catch (error) {
    console.error('Draw error:', error);
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

function updateNoiseWalkers() {
  // Sync walkers with current cell states
  let walkerIndex = 0;
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      let cell = currentCells[column][row];

      if (cell === 1) {
        if (walkerIndex < noiseWalkers.length) {
          noiseWalkers[walkerIndex].alive = true;
          noiseWalkers[walkerIndex].age++;
        } else {
          createNoiseWalker(column, row);
        }
        walkerIndex++;
      }
    }
  }

  // Mark extra walkers as dead
  for (let i = walkerIndex; i < noiseWalkers.length; i++) {
    noiseWalkers[i].alive = false;
  }

  // Remove dead walkers after fade out
  for (let i = noiseWalkers.length - 1; i >= 0; i--) {
    if (!noiseWalkers[i].alive && noiseWalkers[i].age > 60) {
      noiseWalkers.splice(i, 1);
    }
  }

  // Update noise positions
  for (let walker of noiseWalkers) {
    if (walker.alive) {
      let noiseX = noise(
        time * walker.noiseSpeed + walker.noiseSeed,
        walker.noiseSeed * 0.5
      );
      let noiseY = noise(
        time * walker.noiseSpeed + walker.noiseSeed * 2,
        walker.noiseSeed * 1.5
      );
      let noiseZ = noise(
        time * walker.noiseSpeed + walker.noiseSeed * 3,
        walker.noiseSeed * 2.5
      );

      walker.offsetX = (noiseX * 2 - 1) * walker.amplitude;
      walker.offsetY = (noiseY * 2 - 1) * walker.amplitude;
      walker.offsetZ = (noiseZ * 2 - 1) * walker.amplitude;
    } else {
      // Fade out dead walkers
      walker.offsetX *= 0.9;
      walker.offsetY *= 0.9;
      walker.offsetZ *= 0.9;
      walker.amplitude *= 0.95;
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
    drawCenteredFace(face.pos, face.rot, cubeSize, spacing);
  }
}

function drawCenteredFace(pos, rot, size, spacing) {
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

      let alpha = walker.alive ? 200 : map(walker.age, 60, 0, 100, 0);
      fill(walker.color);

      let size = cellSize * (walker.alive ? 1.0 : 0.6);
      box(size);

      pop();
    }
  }
  pop();
}

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

function assignColors() {
  colorsArray = [];

  if (customColors && customColors.length >= 5) {
    // Create a fresh copy of customColors array
    let tempColors = customColors.slice();

    // Fisher-Yates shuffle algorithm
    for (let i = tempColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tempColors[i], tempColors[j]] = [tempColors[j], tempColors[i]];
    }

    // Take first 5 unique colors
    colorsArray = tempColors.slice(0, 5);

    // Ensure we don't get the same colors repeatedly
    if (colorsArray.length === 5) {
      // Remove the used colors from temp array to avoid repeats
      customColors = customColors.filter(color => !colorsArray.includes(color));

      // If we're running low on colors, reset the palette
      if (customColors.length < 10) {
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
        ].slice(); // Fresh copy
      }
    }
  } else {
    // Fallback colors
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
