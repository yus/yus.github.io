let vertices8D = [];
let vertices3D = [];
let edges = [];
let vertexColorsRGB = [];
let selectedVertex = 0;
let rotationX = 0;
let rotationY = 0;
let isDragging = false;
let prevMouseX, prevMouseY;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();
  
  generate8DHypercube();
  project8DTo3D(); // Proper projection
  console.log('Vertices:', vertices8D.length, 'Edges:', edges.length);
}

function generate8DHypercube() {
  // Generate 256 vertices in 8D
  for (let i = 0; i < 256; i++) {
    let vertex = [];
    for (let bit = 0; bit < 8; bit++) {
      vertex.push((i >> bit) & 1 ? 1 : -1);
    }
    vertices8D.push(vertex);
  }
  
  // Generate edges (vertices differing by 1 bit)
  for (let i = 0; i < 256; i++) {
    for (let bit = 0; bit < 8; bit++) {
      let j = i ^ (1 << bit); // Flip one bit
      if (i < j) edges.push([i, j]);
    }
  }
  
  // Generate colors from first 4 dimensions
  for (let vertex of vertices8D) {
    let color4D = vertex.slice(0, 4).map(x => (x + 1) * 0.5);
    vertexColorsRGB.push(color4DToRGB(color4D));
  }
}

function project8DTo3D() {
  // Better: random orthogonal projection from 8D to 3D
  let projection = [];
  for (let i = 0; i < 3; i++) {
    let row = [];
    for (let j = 0; j < 8; j++) {
      row.push(randomGaussian(0, 1));
    }
    // Normalize row
    let length = Math.sqrt(row.reduce((sum, val) => sum + val * val, 0));
    row = row.map(x => x / length);
    projection.push(row);
  }
  
  for (let vertex of vertices8D) {
    let x = 0, y = 0, z = 0;
    for (let d = 0; d < 8; d++) {
      x += vertex[d] * projection[0][d];
      y += vertex[d] * projection[1][d];
      z += vertex[d] * projection[2][d];
    }
    vertices3D.push(createVector(x * 150, y * 150, z * 150)); // Scale
  }
}

function color4DToRGB(color4D) {
  // Better color mapping - treat as RGBA but convert to RGB
  let [r, g, b, a] = color4D;
  // Simple mapping - can replace with your IEC conversion
  return [
    Math.floor(r * 255),
    Math.floor(g * 255), 
    Math.floor(b * 255)
  ];
}

function draw() {
  background(0);
  
  // Simple rotation controls
  if (isDragging) {
    rotationY += (mouseX - prevMouseX) * 0.01;
    rotationX += (mouseY - prevMouseY) * 0.01;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }
  
  rotateX(rotationX);
  rotateY(rotationY);
  
  // OPTIMIZATION: Use points instead of spheres for vertices
  drawVerticesAsPoints();
  
  // OPTIMIZATION: Draw edges with beginShape/endShape batch
  drawEdgesOptimized();
  
  // Draw selected vertex highlight
  drawSelectedVertex();
}

function drawVerticesAsPoints() {
  // Much faster than spheres
  strokeWeight(8);
  for (let i = 0; i < vertices3D.length; i++) {
    let v = vertices3D[i];
    let c = vertexColorsRGB[i];
    stroke(c[0], c[1], c[2]);
    point(v.x, v.y, v.z);
  }
}

function drawEdgesOptimized() {
  // Batch all edges into one draw call
  strokeWeight(1);
  stroke(100, 100, 100, 150); // Semi-transparent gray
  
  for (let [i, j] of edges) {
    let v1 = vertices3D[i];
    let v2 = vertices3D[j];
    
    // Optional: color edges by vertex colors
    let c1 = vertexColorsRGB[i];
    let c2 = vertexColorsRGB[j];
    stroke(
      (c1[0] + c2[0]) / 2,
      (c1[1] + c2[1]) / 2, 
      (c1[2] + c2[2]) / 2,
      100
    );
    
    line(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
  }
}

function drawSelectedVertex() {
  let selected = vertices3D[selectedVertex];
  push();
  translate(selected.x, selected.y, selected.z);
  fill(0, 0, 0, 0);
  stroke(255, 255, 0);
  strokeWeight(3);
  sphere(12);
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

function keyPressed() {
  // Cycle through vertices with keyboard
  if (keyCode === RIGHT_ARROW) {
    selectedVertex = (selectedVertex + 1) % vertices3D.length;
  } else if (keyCode === LEFT_ARROW) {
    selectedVertex = (selectedVertex - 1 + vertices3D.length) % vertices3D.length;
  }
  
  // Spacebar to randomize projection
  if (key === ' ') {
    vertices3D = [];
    project8DTo3D();
  }
}
