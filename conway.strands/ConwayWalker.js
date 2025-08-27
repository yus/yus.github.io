// John Conway Game of Life in 3D Cube with Barnes-Hut Gravitational Trails

let colorsArray = [], cnt, cnvs;
let cellSize = 24; // Increased cell size for larger cube
let gridSize = 12; // Size of the Conway grid (gridSize x gridSize x gridSize)
let currentCells = [], nextCells = [];
let slider;
let rotationX = Math.PI / 6, rotationY = Math.PI / 4, rotationZ = 0;
let prevMouseX = 0, prevMouseY = 0;
let isDragging = false;
let inertiaX = 0, inertiaY = 0;
let particles = [];
let autoRotation = true;
let theta = 0.5; // Barnes-Hut parameter
let time = 0;

// Barnes-Hut Octree classes
class Octree {
  constructor(boundary, capacity = 8) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.particles = [];
    this.divided = false;
    this.mass = 0;
    this.com = {x: 0, y: 0, z: 0};
  }

  insert(particle) {
    if (!this.boundary.contains(particle.position)) return false;

    if (this.particles.length < this.capacity && !this.divided) {
      this.particles.push(particle);
      this.updateMass(particle);
      return true;
    }

    if (!this.divided) this.subdivide();

    if (this.northeastFront.insert(particle)) return true;
    if (this.northwestFront.insert(particle)) return true;
    if (this.southeastFront.insert(particle)) return true;
    if (this.southwestFront.insert(particle)) return true;
    if (this.northeastBack.insert(particle)) return true;
    if (this.northwestBack.insert(particle)) return true;
    if (this.southeastBack.insert(particle)) return true;
    if (this.southwestBack.insert(particle)) return true;

    return false;
  }

  subdivide() {
    const x = this.boundary.x;
    const y = this.boundary.y;
    const z = this.boundary.z;
    const w = this.boundary.w / 2;
    const h = this.boundary.h / 2;
    const d = this.boundary.d / 2;

    const nef = new Boundary(x + w/2, y - h/2, z - d/2, w, h, d);
    const nwf = new Boundary(x - w/2, y - h/2, z - d/2, w, h, d);
    const sef = new Boundary(x + w/2, y + h/2, z - d/2, w, h, d);
    const swf = new Boundary(x - w/2, y + h/2, z - d/2, w, h, d);
    const neb = new Boundary(x + w/2, y - h/2, z + d/2, w, h, d);
    const nwb = new Boundary(x - w/2, y - h/2, z + d/2, w, h, d);
    const seb = new Boundary(x + w/2, y + h/2, z + d/2, w, h, d);
    const swb = new Boundary(x - w/2, y + h/2, z + d/2, w, h, d);

    this.northeastFront = new Octree(nef, this.capacity);
    this.northwestFront = new Octree(nwf, this.capacity);
    this.southeastFront = new Octree(sef, this.capacity);
    this.southwestFront = new Octree(swf, this.capacity);
    this.northeastBack = new Octree(neb, this.capacity);
    this.northwestBack = new Octree(nwb, this.capacity);
    this.southeastBack = new Octree(seb, this.capacity);
    this.southwestBack = new Octree(swb, this.capacity);

    this.divided = true;

    for (let p of this.particles) {
      this.insert(p);
    }
    this.particles = [];
  }

  updateMass(particle) {
    const totalMass = this.mass + particle.mass;
    this.com.x = (this.com.x * this.mass + particle.position.x * particle.mass) / totalMass;
    this.com.y = (this.com.y * this.mass + particle.position.y * particle.mass) / totalMass;
    this.com.z = (this.com.z * this.mass + particle.position.z * particle.mass) / totalMass;
    this.mass = totalMass;
  }

  calculateForce(particle, G = 0.4) {
    if (this.mass === 0) return {x: 0, y: 0, z: 0};

    const dx = this.com.x - particle.position.x;
    const dy = this.com.y - particle.position.y;
    const dz = this.com.z - particle.position.z;
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz) + 1;

    const s = Math.max(this.boundary.w, this.boundary.h, this.boundary.d);
    if (s / dist < theta || !this.divided) {
      if (dist > 0) {
        const force = G * particle.mass * this.mass / (dist * dist);
        return {
          x: force * dx / dist,
          y: force * dy / dist,
          z: force * dz / dist
        };
      }
      return {x: 0, y: 0, z: 0};
    }

    let force = {x: 0, y: 0, z: 0};
    if (this.divided) {
      force = this.northeastFront.calculateForce(particle, G);
      force.x += this.northwestFront.calculateForce(particle, G).x;
      force.y += this.northwestFront.calculateForce(particle, G).y;
      force.z += this.northwestFront.calculateForce(particle, G).z;
      // Add all other children...
    }
    return force;
  }
}

class Boundary {
  constructor(x, y, z, w, h, d) {
    this.x = x; this.y = y; this.z = z;
    this.w = w; this.h = h; this.d = d;
  }

  contains(position) {
    return (
      position.x >= this.x - this.w/2 &&
      position.x <= this.x + this.w/2 &&
      position.y >= this.y - this.h/2 &&
      position.y <= this.y + this.h/2 &&
      position.z >= this.z - this.d/2 &&
      position.z <= this.z + this.d/2
    );
  }
}

class Particle {
  constructor(x, y, z, mass, color) {
    this.position = {x, y, z};
    this.velocity = {
      x: (Math.random() - 0.5) * 0.5, // Reduced initial velocity
      y: (Math.random() - 0.5) * 0.5,
      z: (Math.random() - 0.5) * 0.5
    };
    this.acceleration = {x: 0, y: 0, z: 0};
    this.mass = mass;
    this.color = color;
    this.maxSpeed = 2; // Reduced max speed
    this.trail = [];
    this.trailLength = 15; // Reduced trail length
    this.size = cellSize * 0.6; // Particle size matches cell size
  }

  update() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.velocity.z += this.acceleration.z;

    const speed = Math.sqrt(
      this.velocity.x*this.velocity.x +
      this.velocity.y*this.velocity.y +
      this.velocity.z*this.velocity.z
    );
    if (speed > this.maxSpeed) {
      this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
      this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
      this.velocity.z = (this.velocity.z / speed) * this.maxSpeed;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;

    this.trail.push({...this.position});
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }

    this.acceleration = {x: 0, y: 0, z: 0};
  }

  applyForce(force) {
    this.acceleration.x += force.x / this.mass;
    this.acceleration.y += force.y / this.mass;
    this.acceleration.z += force.z / this.mass;
  }
}

// Conway Cell Class
class Cell {
  constructor(x, y, z, state = false) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.state = state;
    this.nextState = state;
    this.color = '#FFFFFF';
    this.age = 0;
    this.isOnFace = false; // Track if cell is on cube face
  }

  setColorFromPalette(colors) {
    if (this.state && colors.length > 0) {
      this.color = colors[this.age % colors.length];
    } else {
      this.color = '#FFFFFF';
    }
  }
}

function preload() {
  // Color palette initialization
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

  slider = createSlider(1, 60, 30, 1);
  slider.position(100, 220);
  slider.size(220);
  slider.input(() => {
    // Only control Conway simulation speed
    // No need to change frameRate here as it's handled in draw()
  });

  // Initialize 3D Conway grid
  initializeConwayGrid();

  // Create initial particles from alive cells
  createParticlesFromAliveCells();

  assignColors();
}

function draw() {
  time++;
  let conwaySpeed = slider.value();

  // Update Conway simulation based on slider value
  if (frameCount % Math.max(1, Math.floor(60 / conwaySpeed)) === 0) {
    updateConway();
    createParticlesFromAliveCells();
  }

  // Update physics
  updatePhysics();

  applyAutoRotation();

  drawScene();

  if (isDragging) {
    handleRotation();
  }

  // Display frame rate (not Conway speed)
  select('#framecount').html('<h2> ' + frameRate(60).toFixed(1) + ' FPS </h2>');
}

function initializeConwayGrid() {
  currentCells = [];
  const gridOffset = (gridSize - 1) * cellSize / 2;

  for (let x = 0; x < gridSize; x++) {
    currentCells[x] = [];
    for (let y = 0; y < gridSize; y++) {
      currentCells[x][y] = [];
      for (let z = 0; z < gridSize; z++) {
        // Only create cells on the faces of the cube
        const isOnFace = (
          x === 0 || x === gridSize - 1 ||
          y === 0 || y === gridSize - 1 ||
          z === 0 || z === gridSize - 1
        );

        // Create a random initial state only for face cells
        const state = isOnFace && Math.random() > 0.7;

        const cell = new Cell(
          x * cellSize - gridOffset,
          y * cellSize - gridOffset,
          z * cellSize - gridOffset,
          state
        );

        cell.isOnFace = isOnFace;
        currentCells[x][y][z] = cell;
      }
    }
  }
}

function updateConway() {
  // Create next generation
  nextCells = [];
  const gridOffset = (gridSize - 1) * cellSize / 2;

  for (let x = 0; x < gridSize; x++) {
    nextCells[x] = [];
    for (let y = 0; y < gridSize; y++) {
      nextCells[x][y] = [];
      for (let z = 0; z < gridSize; z++) {
        const currentCell = currentCells[x][y][z];

        // Only update cells on the faces
        if (!currentCell.isOnFace) {
          nextCells[x][y][z] = new Cell(
            x * cellSize - gridOffset,
            y * cellSize - gridOffset,
            z * cellSize - gridOffset,
            false
          );
          continue;
        }

        const neighbors = countNeighbors(x, y, z);
        let nextState = false;

        // Conway's Game of Life rules
        if (currentCell.state && (neighbors === 2 || neighbors === 3)) {
          nextState = true; // Survival
          currentCell.age++;
        } else if (!currentCell.state && neighbors === 3) {
          nextState = true; // Birth
        }

        const nextCell = new Cell(
          x * cellSize - gridOffset,
          y * cellSize - gridOffset,
          z * cellSize - gridOffset,
          nextState
        );

        nextCell.isOnFace = true;

        if (nextState) {
          nextCell.age = currentCell.state ? currentCell.age + 1 : 0;
        }

        nextCell.setColorFromPalette(colorsArray);
        nextCells[x][y][z] = nextCell;
      }
    }
  }

  // Replace current generation with next generation
  currentCells = nextCells;
}

function countNeighbors(x, y, z) {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        if (dx === 0 && dy === 0 && dz === 0) continue;

        const nx = (x + dx + gridSize) % gridSize;
        const ny = (y + dy + gridSize) % gridSize;
        const nz = (z + dz + gridSize) % gridSize;

        if (currentCells[nx] && currentCells[nx][ny] && currentCells[nx][ny][nz]) {
          if (currentCells[nx][ny][nz].state && currentCells[nx][ny][nz].isOnFace) {
            count++;
          }
        }
      }
    }
  }
  return count;
}

function createParticlesFromAliveCells() {
  // Only add new particles occasionally to prevent overcrowding
  if (frameCount % 10 !== 0) return;

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        const cell = currentCells[x][y][z];
        if (cell.state && cell.isOnFace && Math.random() > 0.8) {
          const colorIndex = cell.age % colorsArray.length;
          const mass = 8 + Math.random() * 8;
          particles.push(new Particle(
            cell.x,
            cell.y,
            cell.z,
            mass,
            colorsArray[colorIndex]
          ));
        }
      }
    }
  }

  // Limit total particles to prevent performance issues
  if (particles.length > 150) {
    particles = particles.slice(particles.length - 150);
  }
}

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

  // Update cell colors with new palette
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        currentCells[x][y][z].setColorFromPalette(colorsArray);
      }
    }
  }

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

  let conwayLabel = createDiv('CONWAY SPEED:').parent('#footer');
  conwayLabel.position(100, 60);
  conwayLabel.style('color', 'white');
  conwayLabel.style('font-family', 'monospace');

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
  assignColors();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 220);
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

function updatePhysics() {
  // Create Octree for Barnes-Hut
  const boundary = new Boundary(0, 0, 0, 600, 600, 600); // Larger boundary for bigger cube
  const octree = new Octree(boundary);

  // Insert all particles into Octree
  for (let particle of particles) {
    octree.insert(particle);
  }

  // Calculate forces and update particles
  for (let particle of particles) {
    const force = octree.calculateForce(particle);
    particle.applyForce(force);
    particle.update();
  }
}

function drawScene() {
  background(40);

  rotateX(rotationX);
  rotateY(rotationY);
  rotateZ(rotationZ);

  ambientLight(150);
  directionalLight(255, 255, 255, 0, -1, 0);
  directionalLight(200, 200, 200, 0, 1, 0);

  // Draw Conway cells
  drawConwayCells();

  // Draw particles with trails
  drawParticlesWithTrails();

  // Draw cube framework
  drawCubeFramework();
}

function drawConwayCells() {
  push();
  noStroke();

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        const cell = currentCells[x][y][z];
        if (cell.state && cell.isOnFace) {
          push();
          translate(cell.x, cell.y, cell.z);
          fill(cell.color);
          box(cellSize * 0.8);
          pop();
        }
      }
    }
  }

  pop();
}

function drawCubeFramework() {
  push();
  stroke(100, 100, 100, 100);
  strokeWeight(1);
  noFill();
  box(gridSize * cellSize + 10);
  pop();
}

function drawParticlesWithTrails() {
  for (let particle of particles) {
    // Draw trail with fading effect
    push();
    noFill();
    beginShape();
    for (let i = 0; i < particle.trail.length; i++) {
      let point = particle.trail[i];
      let alpha = map(i, 0, particle.trail.length, 50, 200);
      stroke(red(particle.color), green(particle.color), blue(particle.color), alpha);
      strokeWeight(map(i, 0, particle.trail.length, 1, 3));
      vertex(point.x, point.y, point.z);
    }
    endShape();
    pop();

    // Draw particle as a cube (same as alive cells)
    push();
    translate(particle.position.x, particle.position.y, particle.position.z);
    fill(particle.color);
    noStroke();
    box(particle.size);
    pop();
  }
}
