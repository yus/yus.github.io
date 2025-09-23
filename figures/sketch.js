let vertices8D = [];
let vertices3D = [];
let edges = [];
let vertexColorsRGB = [];
let selectedVertex = 0;

// Camera controls
let rotationX = 0;
let rotationY = 0;
let zoom = 1.0;
let targetZoom = 1.0;

// Hammer.js manager
let hammerManager;
let isDragging = false;
let lastPanPosition = { x: 0, y: 0 };

// Performance optimization
let vertexPoints = [];
let lastFrameTime = 0;
const FRAME_INTERVAL = 1000 / 30; // Target 30 FPS

function setup() {
    // Create canvas first
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.style('display', 'block');
    
    // Initialize Hammer.js on the canvas element
    initHammerJS();
    
    // Generate geometry
    generate8DHypercube();
    project8DTo3D();
    precomputeGeometry();
    
    // Set initial camera
    rotationX = -0.5;
    rotationY = 0.8;
    
    console.log('8D Hypercube loaded:');
    console.log('- Vertices:', vertices8D.length);
    console.log('- Edges:', edges.length);
    console.log('- Hammer.js initialized');
}

function initHammerJS() {
    // Get the actual canvas DOM element
    let canvasElement = document.querySelector('canvas');
    
    // Create Hammer manager with custom options
    hammerManager = new Hammer.Manager(canvasElement, {
        touchAction: 'none',
        recognizers: [
            [Hammer.Pan, { direction: Hammer.DIRECTION_ALL, threshold: 0 }],
            [Hammer.Pinch, { enable: true }],
            [Hammer.Tap, { event: 'tap', taps: 1 }]
        ]
    });
    
    // Enable simultaneous recognition of pan and pinch
    hammerManager.get('pinch').recognizeWith('pan');
    hammerManager.get('pan').recognizeWith('pinch');
    
    // Set up event listeners
    hammerManager.on('panstart', handlePanStart);
    hammerManager.on('panmove', handlePanMove);
    hammerManager.on('panend', handlePanEnd);
    hammerManager.on('pinchstart', handlePinchStart);
    hammerManager.on('pinchmove', handlePinchMove);
    hammerManager.on('pinchend', handlePinchEnd);
    hammerManager.on('tap', handleTap);
}

function generate8DHypercube() {
    // Generate 256 vertices in 8D (-1 to 1)
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
    
    // Generate colors using 4D color space mapping
    for (let vertex of vertices8D) {
        let color4D = vertex.slice(0, 4).map(x => (x + 1) * 0.5);
        vertexColorsRGB.push(iec4DToRGB(color4D));
    }
}

function iec4DToRGB(color4D) {
    // Your IEC 4D to RGB conversion - placeholder implementation
    let [c1, c2, c3, c4] = color4D;
    
    // Enhanced color mapping for better visual distinction
    let r = Math.sin(c1 * Math.PI * 2) * 127 + 128;
    let g = Math.sin(c2 * Math.PI * 2 + Math.PI * 2/3) * 127 + 128;
    let b = Math.sin(c3 * Math.PI * 2 + Math.PI * 4/3) * 127 + 128;
    
    // Apply brightness from 4th dimension
    let brightness = 0.3 + c4 * 0.7;
    r *= brightness;
    g *= brightness;
    b *= brightness;
    
    return [
        constrain(Math.floor(r), 0, 255),
        constrain(Math.floor(g), 0, 255),
        constrain(Math.floor(b), 0, 255)
    ];
}

function project8DTo3D() {
    // Stable orthogonal projection matrix for consistent viewing
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
        vertices3D.push(createVector(x * 180, y * 180, z * 180));
    }
}

function precomputeGeometry() {
    // Precompute for better performance
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
    // Frame rate limiting for mobile performance
    let currentTime = millis();
    if (currentTime - lastFrameTime < FRAME_INTERVAL) {
        return;
    }
    lastFrameTime = currentTime;
    
    background(0);
    
    // Smooth zoom interpolation
    zoom = lerp(zoom, targetZoom, 0.1);
    
    // Apply camera transformations
    let scaleFactor = min(width, height) * 0.0008 * zoom;
    scale(scaleFactor);
    
    rotateX(rotationX);
    rotateY(rotationY);
    
    // Draw geometry
    drawEdges();
    drawVertices();
    drawSelectedVertex();
    
    // Update UI
    updateUI();
}

function drawVertices() {
    // Simple dots for mobile performance
    strokeWeight(10);
    for (let point of vertexPoints) {
        stroke(point.color[0], point.color[1], point.color[2]);
        point(point.pos.x, point.pos.y, point.pos.z);
    }
}

function drawEdges() {
    strokeWeight(1);
    for (let [i, j] of edges) {
        let v1 = vertices3D[i];
        let v2 = vertices3D[j];
        
        // Edge coloring based on vertex colors
        let c1 = vertexColorsRGB[i];
        let c2 = vertexColorsRGB[j];
        stroke(
            (c1[0] + c2[0]) / 2,
            (c1[1] + c2[1]) / 2,
            (c1[2] + c2[2]) / 2,
            150
        );
        
        line(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
    }
}

function drawSelectedVertex() {
    let selected = vertices3D[selectedVertex];
    let selectedColor = vertexColorsRGB[selectedVertex];
    
    push();
    translate(selected.x, selected.y, selected.z);
    
    // Empty circled dot as requested
    noFill();
    stroke(255, 255, 0);
    strokeWeight(3);
    circle(0, 0, 25);
    
    // Inner highlight
    stroke(255, 200, 0, 100);
    strokeWeight(1);
    circle(0, 0, 28);
    
    pop();
}

// Hammer.js Event Handlers
function handlePanStart(event) {
    isDragging = true;
    lastPanPosition.x = event.center.x;
    lastPanPosition.y = event.center.y;
}

function handlePanMove(event) {
    if (!isDragging) return;
    
    let deltaX = event.center.x - lastPanPosition.x;
    let deltaY = event.center.y - lastPanPosition.y;
    
    rotationY += deltaX * 0.01;
    rotationX += deltaY * 0.01;
    
    lastPanPosition.x = event.center.x;
    lastPanPosition.y = event.center.y;
}

function handlePanEnd(event) {
    isDragging = false;
}

function handlePinchStart(event) {
    // Store initial zoom for relative scaling
}

function handlePinchMove(event) {
    targetZoom *= event.scale;
    targetZoom = constrain(targetZoom, 0.3, 3.0);
    
    // Reset scale for next frame to get relative scaling
    event.preventDefault();
}

function handlePinchEnd(event) {
    // Clean up if needed
}

function handleTap(event) {
    // Convert tap coordinates to sketch coordinates
    let sketchX = event.center.x - width / 2;
    let sketchY = event.center.y - height / 2;
    
    let closestVertex = findClosestVertex(sketchX, sketchY);
    if (closestVertex !== -1) {
        selectedVertex = closestVertex;
    }
}

function findClosestVertex(screenX, screenY) {
    let closest = -1;
    let minDist = 80; // Pixel threshold for selection
    
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
    let y = worldPos.y * cos(rotationX) + worldPos.z * sin(rotationX);
    return createVector(x, y);
}

function updateUI() {
    let selectedColor = vertexColorsRGB[selectedVertex];
    document.getElementById('selectedIndex').textContent = selectedVertex;
    document.getElementById('colorInfo').textContent = 
        `Color: RGB(${selectedColor[0]}, ${selectedColor[1]}, ${selectedColor[2]})`;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Clean up Hammer.js when sketch is removed
function remove() {
    if (hammerManager) {
        hammerManager.destroy();
    }
}
