// John Conway Game of Life in 3D Cube with Noise Walkers
// John Conway Game of Life in 3D Cube with Custom Noise Walkers

// 3D Barnes-Hut Gravitational Cube
let colorsArray = [], cnt, cnvs;
let cellSize = 12;
let columnCount, rowCount;
let currentCells = [], nextCells = [];
let slider;
let rotationX = Math.PI / 6, rotationY = Math.PI / 4, rotationZ = 0;
let prevMouseX = 0, prevMouseY = 0;
let isDragging = false;
let inertiaX = 0, inertiaY = 0;
let particles = [];
let autoRotation = true;
let theta = 0.5; // Barnes-Hut parameter

// Barnes-Hut QuadTree for 3D (Octree)
class Octree {
  constructor(boundary, capacity = 8) {
    this.boundary = boundary; // {x, y, z, w, h, d}
    this.capacity = capacity;
    this.particles = [];
    this.divided = false;
    this.mass = 0;
    this.com = {x: 0, y: 0, z: 0}; // Center of mass
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

    // Create 8 octants
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

    // Move existing particles to appropriate children
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
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz) + 1; // Avoid division by zero

    // If node is far enough or is a leaf node, use approximation
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

    // Otherwise, traverse children
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
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: (Math.random() - 0.5) * 2
    };
    this.acceleration = {x: 0, y: 0, z: 0};
    this.mass = mass;
    this.color = color;
    this.maxSpeed = 4;
    this.trail = [];
    this.trailLength = 20;
  }

  update() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.velocity.z += this.acceleration.z;

    // Limit velocity
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

    // Add to trail
    this.trail.push({...this.position});
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }

    // Reset acceleration
    this.acceleration = {x: 0, y: 0, z: 0};
  }

  applyForce(force) {
    this.acceleration.x += force.x / this.mass;
    this.acceleration.y += force.y / this.mass;
    this.acceleration.z += force.z / this.mass;
  }
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

  slider = createSlider(1, 60, 30, 1);
  slider.position(100, 220);
  slider.size(220);

  columnCount = 12;
  rowCount = 12;

  // Create initial particles on cube faces
  createParticlesOnCube();
  assignColors();
}

function draw() {
  let rv = slider.value();
  frameRate(rv);

  frc = frameCount;
  select('#framecount').html('<h2> ' + frc + ' </h2>');

  // Update physics
  updatePhysics();

  applyAutoRotation();

  drawScene();

  if (isDragging) {
    handleRotation();
  }
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
  initNoiseWalkers();
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

function createParticlesOnCube() {
  particles = [];
  const cubeSize = 150;
  const spacing = cubeSize / 10;

  // Create particles on all 6 faces of the cube
  const faces = [
    { normal: [1, 0, 0], offset: cubeSize/2 },   // Right
    { normal: [-1, 0, 0], offset: -cubeSize/2 }, // Left
    { normal: [0, 1, 0], offset: cubeSize/2 },   // Top
    { normal: [0, -1, 0], offset: -cubeSize/2 }, // Bottom
    { normal: [0, 0, 1], offset: cubeSize/2 },   // Front
    { normal: [0, 0, -1], offset: -cubeSize/2 }  // Back
  ];

  for (let face of faces) {
    for (let i = -5; i <= 5; i++) {
      for (let j = -5; j <= 5; j++) {
        if (Math.random() > 0.7) {
          let x = i * spacing;
          let y = j * spacing;
          let z = face.offset;

          // Adjust based on face normal
          if (face.normal[0] !== 0) [x, y, z] = [face.offset, y, x];
          if (face.normal[1] !== 0) [x, y, z] = [x, face.offset, y];

          let colorIndex = Math.floor(Math.random() * colorsArray.length);
          let mass = 10 + Math.random() * 20;
          particles.push(new Particle(x, y, z, mass, colorsArray[colorIndex]));
        }
      }
    }
  }
}

function updatePhysics() {
  // Create Octree for Barnes-Hut
  const boundary = new Boundary(0, 0, 0, 300, 300, 300);
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

  // Draw cube framework
  drawCubeFramework();

  // Draw particles with trails
  drawParticlesWithTrails();
}

function drawCubeFramework() {
  push();
  stroke(100, 100, 100, 100);
  strokeWeight(1);
  noFill();
  box(300, 300, 300);
  pop();
}

function drawParticlesWithTrails() {
  for (let particle of particles) {
    // Draw trail
    push();
    noFill();
    stroke(particle.color);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < particle.trail.length; i++) {
      let point = particle.trail[i];
      let alpha = map(i, 0, particle.trail.length, 50, 200);
      stroke(particle.color);
      vertex(point.x, point.y, point.z);
    }
    endShape();
    pop();

    // Draw particle
    push();
    translate(particle.position.x, particle.position.y, particle.position.z);
    fill(particle.color);
    noStroke();
    sphere(particle.mass / 5);
    pop();
  }
}

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

// Add this new function for footprint trails:
function drawFootprintTrails() {
  push();
  noStroke();
  blendMode(ADD);

  for (let walker of noiseWalkers) {
    if (walker.alive) {
      // Create fading footprints along the orbital path
      for (let i = 0; i < 3; i++) {
        let trailAge = walker.age - i * 5;
        if (trailAge > 0) {
          push();

          // Calculate trail position based on previous noise values
          let trailTime = time - i * 0.2;
          let trailX = customNoise(
            trailTime * walker.noiseSpeed + walker.noiseSeed,
            walker.noiseSeed * 0.5,
            walker.noiseSeed * 1.5
          );
          let trailY = customNoise(
            trailTime * walker.noiseSpeed + walker.noiseSeed * 2,
            walker.noiseSeed * 1.5,
            walker.noiseSeed * 2.5
          );
          let trailZ = customNoise(
            trailTime * walker.noiseSpeed + walker.noiseSeed * 3,
            walker.noiseSeed * 2.5,
            walker.noiseSeed * 3.5
          );

          translate(
            walker.baseX + (trailX * 2 - 1) * walker.amplitude,
            walker.baseY + (trailY * 2 - 1) * walker.amplitude,
            walker.baseZ + (trailZ * 2 - 1) * walker.amplitude
          );

          let alpha = 100 - i * 30;
          let trailColor = color(walker.color);
          trailColor.setAlpha(alpha);
          fill(trailColor);

          box(cellSize * 0.4);
          pop();
        }
      }
    }
  }

  blendMode(BLEND);
  pop();
}
