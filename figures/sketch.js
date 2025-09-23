let vertices8D = [];
let vertices3D = [];
let edges = [];
let vertexColorsRGB = [];
let selectedVertex = 0;

// Mobile touch controls
let rotationX = 0, rotationY = 0;
let lastTouchX, lastTouchY;
let zoom = 1.0;
let isDragging = false;

// Performance optimization
let vertexPoints = [];
let edgeLines = [];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.touchMoved(touchMoveHandler);
    
    // Mobile performance settings
    pixelDensity(1);
    
    generate8DHypercube();
    project8DTo3D();
    precomputeGeometry();
    
    console.log('Ready: ' + vertices8D.length + ' vertices, ' + edges.length + ' edges');
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
            let j = i ^ (1 << bit);
            if (i < j) edges.push([i, j]);
        }
    }
    
    // Generate colors using YOUR IEC 4D color mapping
    for (let vertex of vertices8D) {
        let color4D = vertex.slice(0, 4).map(x => (x + 1) * 0.5);
        vertexColorsRGB.push(iec4DToRGB(color4D));
    }
}

function iec4DToRGB(color4D) {
    // YOUR IEC COLOR MAPPING - replace with your actual function
    let [dim1, dim2, dim3, dim4] = color4D;
    
    // Example mapping - modify this to match your IEC space
    // This is where you'd put your specific 4D->RGB conversion
    let r = Math.pow(dim1, 0.8) * 255;
    let g = Math.pow(dim2, 0.9) * 255;
    let b = Math.pow(dim3, 1.0) * 255;
    
    // Use 4th dimension for brightness/alpha modulation
    let brightness = 0.5 + dim4 * 0.5;
    r *= brightness;
    g *= brightness;
    b *= brightness;
    
    return [constrain(r, 0, 255), constrain(g, 0, 255), constrain(b, 0, 255)];
}

function project8DTo3D() {
    // Stable orthogonal projection
    let projection = [
        [0.35, 0.22, -0.18, 0.41, -0.29, 0.13, 0.17, -0.31],
        [0.27, -0.38, 0.31, 0.19, 0.22, -0.41, 0.25, 0.18],
        [-0.21, 0.31, 0.42, -0.25, 0.33, 0.19, -0.38, 0.22]
    ];
    
    vertices3D = [];
    for (let vertex of vertices8D) {
        let x = 0, y = 0, z = 0;
        for (let d = 0; d < 8; d++) {
            x += vertex[d] * projection[0][d];
            y += vertex[d] * projection[1][d];
            z += vertex[d] * projection[2][d];
        }
        vertices3D.push(createVector(x * 200, y * 200, z * 200));
    }
}

function precomputeGeometry() {
    // Precompute vertex points for performance
    vertexPoints = [];
    for (let i = 0; i < vertices3D.length; i++) {
        vertexPoints.push({
            pos: vertices3D[i],
            color: vertexColorsRGB[i],
            index: i
        });
    }
}

function draw() {
    background(0);
    
    // Mobile-friendly scaling
    let scaleFactor = min(width, height) * 0.001 * zoom;
    scale(scaleFactor);
    
    rotateX(rotationX);
    rotateY(rotationY);
    
    drawEdgesOptimized();
    drawVerticesAsDots(); // Simple dots instead of spheres
    drawSelectedVertexHighlight();
}

function drawVerticesAsDots() {
    // Simple dots - much better for mobile
    strokeWeight(8);
    for (let point of vertexPoints) {
        stroke(point.color[0], point.color[1], point.color[2]);
        point(point.pos.x, point.pos.y, point.pos.z);
    }
}

function drawEdgesOptimized() {
    strokeWeight(1);
    for (let [i, j] of edges) {
        let v1 = vertices3D[i];
        let v2 = vertices3D[j];
        
        // Subtle edge coloring
        let alpha = map(zoom, 0.5, 2, 50, 150);
        stroke(100, 100, 100, alpha);
        
        line(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
    }
}

function drawSelectedVertexHighlight() {
    let selected = vertices3D[selectedVertex];
    push();
    translate(selected.x, selected.y, selected.z);
    
    // Empty circled dot - YOUR REQUESTED STYLE
    fill(0, 0);
    stroke(255, 255, 0); // Yellow highlight
    strokeWeight(3);
    circle(0, 0, 20); // Simple circle instead of sphere
    
    pop();
}

// Mobile touch handlers
let touchStartZoom = 1;
let initialDist = 0;

function touchStarted() {
  // Code for when a touch starts (e.g., selecting a vertex)
  // Use the touches[] array to get touch positions [citation:6]
  return false; // Prevents default browser behavior like scrolling
}

function touchMoved() {
  // Handle one-finger drag for rotation
  if (touches.length === 1) {
    rotationY += touches[0].x - pmouseX;
    rotationX += touches[0].y - pmouseY;
  }
  // Handle two-finger pinch for zoom
  if (touches.length >= 2) {
    let currentDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    if (initialDist === 0) initialDist = currentDist; // Set initial distance on first pinch
    let zoomFactor = currentDist / initialDist;
    zoom = constrain(touchStartZoom * zoomFactor, 0.3, 3.0); // Limit zoom range
  }
  return false; // Prevents default browser behavior
}

function touchEnded() {
  // Reset initial distance when pinch ends
  if (touches.length < 2) {
    initialDist = 0;
    touchStartZoom = zoom; // Remember the new zoom level
  }
}

function findClosestVertex(screenX, screenY) {
    let closest = -1;
    let minDist = 50; // Pixel threshold
    
    for (let i = 0; i < vertices3D.length; i++) {
        let screenPos = worldToScreen(vertices3D[i]);
        let d = dist(screenX, screenY, screenPos.x, screenPos.y);
        if (d < minDist) {
            minDist = d;
            closest = i;
        }
    }
    return closest;
}

function worldToScreen(worldPos) {
    // Simple projection to screen space
    let x = worldPos.x * cos(rotationY) - worldPos.z * sin(rotationY);
    let y = worldPos.y;
    return createVector(x, y);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
