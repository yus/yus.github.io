// John Conway Game of Life in 3D Cube with Artistic Feedback
let clr, folor, cnt, cnvs, tinges = [];
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
let feedbackParticles = [];
let glowEffect;
let trailTexture;

function preload() {
  createDefaultColors();
}

function createDefaultColors() {
  tinges = [
    '#211830','#5c6e94','#87f4e2','#fffd97','#ffb594',
    '#d5e05f','#868a61','#d19390','#ad4b45','#78b0e6',
    '#6a78b8','#babfdb','#ededed','#dbd3ba','#b8a363',
    '#232925','#3c5940','#f2a444','#a6351c','#732f17',
    '#1252ff','#1a89ff','#23bcff','#2cebff','#34ffe5',
    '#ffd01e','#b88e1a','#946f21','#664c23','#473625',
    '#b27869','#e8b79b','#ffcf9c','#e8c587','#b5a473',
    '#a88973','#ccc7a2','#f5ffc9','#9ed7d9','#5197b2',
    '#194655','#326e7d','#4b8c9b','#64afc8','#7df0ff',
    '#ff9f00','#cc6a00','#993f00','#661e00','#330900',
    '#c61100','#ff7117','#ffb73d','#ffe073','#fff9bb',
    '#2868a1','#6dace3','#a8d7ff','#ffe3b6','#ffb441',
    '#9bcc00','#665b52','#332828','#544959','#00b3cc',
    '#001454','#5276a4','#ffffff','#ffdf86','#ffa400',
    '#2b3924','#5e923e','#c8ffad','#c4e4fd','#183b59',
    '#692309','#857d69','#c6d4a7','#52706a','#444b69',
    '#d3dff0','#97b2d2','#577ea5','#18608b','#004a76',
    '#ffe7c1','#b2a687','#645d56','#b29687','#ffcdc1',
    '#403e2f','#807c5f','#bfba8e','#e5dfaa','#fff8bd',
    '#161a13','#2b3327','#56664d','#accc9a','#d7ffc1',
    '#fff3c9','#ccc3a1','#999279','#666151','#333128',
    '#113940','#39735d','#ffff94','#ffc950','#ff7400',
    '#fff8dc','#ccaf88','#c19a6b','#8b0000','#003153',
    '#9fc4d6','#b0d6a9','#fff1a0','#ffcf6f','#ffb050',
    '#3c9090','#81c86f','#ffc851','#ff3737','#516fae',
    '#000000','#404040','#808080','#ffffff','#ff9600',
    '#ff8c24','#ffbe5b','#ffdf8e','#fff7c4','#372626',
    '#fff69b','#e5e0a9','#bfbc9d','#807e73','#404040',
    '#f2d97b','#84bf7e','#6e818c','#544a59','#24201f',
    '#302733','#a08378','#f5e7b4','#698062','#273133',
    '#3ebf00','#ffc800','#e50000','#99008f','#006099',
    '#802c2c','#b24d2d','#cc6e1f','#e59a0f','#ffc800',
    '#738069','#999375','#b29e84','#ccafa5','#e5bdde',
    '#7a0000','#ff6747','#ffcfac','#e6c8c8','#4a3737',
    '#402c24','#66463a','#8c6050','#b27a66','#d9947b',
    '#7a0000','#ff6747','#ffcfac','#c9c9c9','#1c1c1c',
    '#b860b4','#f48cda','#ffb8f4','#ff9382','#ae5e4f',
    '#ffa900','#967b45','#c7a259','#e3cea4','#ffffff',
    '#401925','#80483b','#bf8959','#e5bd77','#ffeca7',
    '#4e4e57','#b0b0bf','#e8e9ff','#adac8f','#c9700b',
    '#005a6e','#6496aa','#c8e1e1','#afa0a0','#643c3c',
    '#f5f5f5','#dcdcdc','#a9a9a9','#1f1a17','#bf0000',
    '#1e4566','#5e8268','#b2b04a','#fcda5c','#ffb029',
    '#730202','#b53c25','#bd8d46','#ffb03b','#f6e497',
    '#f2a4a5','#b07777','#7a5353','#4c3434','#291c1c'
  ];
}

function setup() {
  createElts();

  cnvs = createCanvas(windowWidth, windowHeight - 220, WEBGL);
  cnvs.parent(cnt).position(0, 120);

  // Create offscreen graphics for trail effect
  trailTexture = createGraphics(width, height, WEBGL);
  trailTexture.background(0, 10); // Semi-transparent black for trails

  // Create glow effect buffer
  glowEffect = createGraphics(width, height, WEBGL);

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
  colors();

  rotationX = PI / 6;
  rotationY = PI / 4;

  // Initialize feedback particles
  for (let i = 0; i < 100; i++) {
    feedbackParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(2, 8),
      speed: random(0.5, 2),
      color: color(random(tinges)),
      life: random(100, 200)
    });
  }
}

function draw() {
  let rv = slider.value();
  frameRate(rv);

  frc = frameCount;
  select('#framecount').html('<h2> ' + frc + ' </h2>');

  generate();

  // Apply 3D feedback effects
  updateTrailEffect();
  updateGlowEffect();
  updateFeedbackParticles();

  // Draw the scene
  draw3DScene();

  handleRotation();
}

function updateTrailEffect() {
  // Add fading trail of previous frames
  trailTexture.push();
  trailTexture.translate(0, 0, -500);
  trailTexture.tint(255, 15); // Very transparent for slow fade
  trailTexture.image(cnvs, -width/2, -height/2, width, height);
  trailTexture.pop();
}

function updateGlowEffect() {
  // Create glow from active cells
  glowEffect.clear();
  glowEffect.push();
  glowEffect.noStroke();
  glowEffect.blendMode(ADD);

  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      if (currentCells[column][row] === 1) {
        let glowColor = color(clr);
        glowColor.setAlpha(50);
        glowEffect.fill(glowColor);
        glowEffect.ellipse(
          map(column, 0, columnCount, -width/2, width/2),
          map(row, 0, rowCount, -height/2, height/2),
          100, 100
        );
      }
    }
  }
  glowEffect.pop();
}

function updateFeedbackParticles() {
  // Update feedback particles that follow active cells
  for (let particle of feedbackParticles) {
    particle.life--;
    if (particle.life <= 0) {
      // Respawn particle near an active cell
      let activeCells = [];
      for (let column = 0; column < columnCount; column++) {
        for (let row = 0; row < rowCount; row++) {
          if (currentCells[column][row] === 1) {
            activeCells.push({column, row});
          }
        }
      }

      if (activeCells.length > 0) {
        let target = random(activeCells);
        particle.x = map(target.column, 0, columnCount, -200, 200);
        particle.y = map(target.row, 0, rowCount, -200, 200);
        particle.z = random(-100, 100);
        particle.life = random(100, 200);
        particle.color = color(random(tinges));
      }
    }

    // Move particles toward active areas
    particle.x += random(-particle.speed, particle.speed);
    particle.y += random(-particle.speed, particle.speed);
    particle.z += random(-particle.speed, particle.speed);
  }
}

function draw3DScene() {
  background(0, 20); // Semi-transparent black for motion blur effect

  // Apply trail effect as background
  push();
  texture(trailTexture);
  noStroke();
  translate(0, 0, -1000);
  plane(width * 3, height * 3);
  pop();

  // Apply glow effect
  push();
  texture(glowEffect);
  translate(0, 0, -800);
  plane(width * 2, height * 2);
  pop();

  // Main cube rotation
  rotateX(rotationX);
  rotateY(rotationY);

  // Special lighting for artistic effect
  ambientLight(50);
  pointLight(255, 255, 255, 0, 0, 500);
  pointLight(200, 200, 255, 500, 500, 500);

  // Draw feedback particles
  drawFeedbackParticles();

  // Draw the main cube with enhanced effects
  drawArtisticCube();
}

function drawFeedbackParticles() {
  push();
  blendMode(ADD);
  noStroke();

  for (let particle of feedbackParticles) {
    if (particle.life > 0) {
      push();
      translate(particle.x, particle.y, particle.z);
      fill(particle.color);
      sphere(particle.size);
      pop();
    }
  }
  pop();
}

function drawArtisticCube() {
  const cubeSize = 200;
  const faceSize = cubeSize / 2;

  // Enhanced cube drawing with special effects
  let faces = [
    { pos: [0, 0, -faceSize], rot: [0, 0, 0] },       // Front
    { pos: [0, 0, faceSize], rot: [0, PI, 0] },       // Back
    { pos: [0, -faceSize, 0], rot: [-PI/2, 0, 0] },   // Top
    { pos: [0, faceSize, 0], rot: [PI/2, 0, 0] },     // Bottom
    { pos: [-faceSize, 0, 0], rot: [0, -PI/2, 0] },   // Left
    { pos: [faceSize, 0, 0], rot: [0, PI/2, 0] }      // Right
  ];

  for (let face of faces) {
    drawArtisticFace(face.pos, face.rot, cubeSize);
  }
}

function drawArtisticFace(pos, rot, size) {
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

      if (cell === 1) {
        push();
        translate(
          startX + column * cellSize,
          startY + row * cellSize,
          0
        );

        // Dynamic coloring with pulse effect
        let pulse = sin(frameCount * 0.1 + column * 0.2 + row * 0.3) * 0.5 + 0.5;
        let cellColor = lerpColor(color(clr), color(folor), pulse);

        fill(cellColor);
        specularMaterial(255, 255, 255, 150);
        shininess(50);

        // Add slight movement for organic feel
        let wobble = sin(frameCount * 0.2 + column + row) * 2;
        translate(0, 0, wobble);

        // Draw cell with glow effect
        box(cellSize * 0.7);

        // Add energy beams between active cells
        if (frameCount % 30 === 0 && random() > 0.8) {
          drawEnergyBeam(column, row);
        }

        pop();
      }
    }
  }
  pop();
}

function drawEnergyBeam(column, row) {
  // Find another active cell to connect to
  let targets = [];
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      if (currentCells[c][r] === 1 && (c !== column || r !== row)) {
        targets.push({c, r});
      }
    }
  }

  if (targets.length > 0) {
    let target = random(targets);
    let startX = map(column, 0, columnCount, -100, 100);
    let startY = map(row, 0, rowCount, -100, 100);
    let endX = map(target.c, 0, columnCount, -100, 100);
    let endY = map(target.r, 0, rowCount, -100, 100);

    push();
    stroke(255, 150, 100, 100);
    strokeWeight(1);
    line(startX, startY, 0, endX, endY, 0);
    pop();
  }
}

// ... (keep the rest of the functions like handleRotation, mousePressed,
// mouseReleased, mouseClicked, windowResized, randomizeBoard, generate,
// countNeighbors, colors, createElts from previous version)

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

// The remaining functions (handleRotation, mouse interactions,
// Game of Life logic, etc.) stay the same as in the previous version
