let vertices8D = [];
let vertices3D = [];
let edges = [];
let vertexColorsRGB = [];
let selectedVertex = 0;

// Camera controls
let rotationX = -0.5;
let rotationY = 0.8;
let zoom = 1.0;
let targetZoom = 1.0;

// Touch controls
let lastTouchX, lastTouchY;
let touchStartZoom = 1.0;
let initialPinchDist = 0;
let isDragging = false;

// Visual feedback
let gestureFeedback = { active: false, message: "", timeout: 0 };

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    
    // Remove Hammer.js and use native p5.js touch events
    generate8DHypercube();
    project8DTo3D();
    
    console.log('8D Hypercube ready - Touch controls enabled');
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
    
    // Generate edges
    for (let i = 0; i < 256; i++) {
        for (let bit = 0; bit < 8; bit++) {
            let j = i ^ (1 << bit);
            if (i < j) edges.push([i, j]);
        }
    }
    
    // Generate BRIGHT colors
    for (let vertex of vertices8D) {
        let color4D = vertex.slice(0, 4).map(x => (x + 1) * 0.5);
        vertexColorsRGB.push(iec4DToRGB(color4D));
    }
}

function iec4DToRGB(color4D) {
    let [c1, c2, c3, c4] = color4D;
    
    // Very bright and saturated colors
    let r = Math.sin(c1 * Math.PI * 3) * 100 + 155;
    let g = Math.sin(c2 * Math.PI * 3 + 2) * 100 + 155;
    let b = Math.sin(c3 * Math.PI * 3 + 4) * 100 + 155;
    
    return [
        constrain(r, 50, 255),
        constrain(g, 50, 255),
        constrain(b, 50, 255)
    ];
}

function project8DTo3D() {
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

function draw() {
    // Gradient background
    drawGradientBackground();
    
    // Smooth zoom
    zoom = lerp(zoom, targetZoom, 0.2);
    
    // Apply transformations
    let scaleFactor = min(width, height) * 0.0007 * zoom;
    scale(scaleFactor);
    rotateX(rotationX);
    rotateY(rotationY);
    
    // Draw everything
    drawEdges();
    drawVertices();
    drawSelectedVertex();
    
    // UI and feedback
    drawGestureFeedback();
    updateUI();
}

function drawGradientBackground() {
    push();
    resetMatrix();
    noStroke();
    for (let y = 0; y <= height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(color(20, 25, 60), color(5, 10, 20), inter);
        stroke(c);
        line(0, y, width, y);
    }
    pop();
}

function drawVertices() {
    strokeWeight(16);
    for (let i = 0; i < vertices3D.length; i++) {
        let v = vertices3D[i];
        let c = vertexColorsRGB[i];
        stroke(c[0], c[1], c[2], 255);
        point(v.x, v.y, v.z);
    }
}

function drawEdges() {
    strokeWeight(2);
    for (let [i, j] of edges) {
        let v1 = vertices3D[i];
        let v2 = vertices3D[j];
        let c1 = vertexColorsRGB[i];
        let c2 = vertexColorsRGB[j];
        
        stroke(
            (c1[0] + c2[0]) / 2,
            (c1[1] + c2[1]) / 2,
            (c1[2] + c2[2]) / 2,
            180
        );
        line(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
    }
}

function drawSelectedVertex() {
    let selected = vertices3D[selectedVertex];
    push();
    translate(selected.x, selected.y, selected.z);
    
    // Pulsing selection circle
    let pulse = sin(millis() * 0.01) * 5 + 25;
    noFill();
    stroke(255, 255, 0);
    strokeWeight(4);
    circle(0, 0, pulse);
    
    stroke(255, 200, 0, 100);
    strokeWeight(2);
    circle(0, 0, pulse + 8);
    
    pop();
}

function drawGestureFeedback() {
    if (gestureFeedback.active && millis() < gestureFeedback.timeout) {
        push();
        resetMatrix();
        fill(255, 255, 0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(20);
        text(gestureFeedback.message, width/2, height - 50);
        pop();
    }
}

function showFeedback(message, duration = 1000) {
    gestureFeedback.active = true;
    gestureFeedback.message = message;
    gestureFeedback.timeout = millis() + duration;
}

// === TOUCH CONTROLS (Native p5.js) ===

function touchStarted() {
    if (touches.length === 1) {
        // Single touch - start drag
        isDragging = true;
        lastTouchX = touches[0].x;
        lastTouchY = touches[0].y;
        showFeedback("👆 Drag to rotate");
    } else if (touches.length === 2) {
        // Two touches - start pinch
        initialPinchDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
        touchStartZoom = zoom;
        showFeedback("🔍 Pinch to zoom");
    }
    
    // Try vertex selection on tap
    if (touches.length === 1) {
        let closest = findClosestVertex(mouseX - width/2, mouseY - height/2);
        if (closest !== -1) {
            selectedVertex = closest;
            showFeedback("✅ Selected vertex " + closest);
        }
    }
    
    return false; // Prevent default
}

function touchMoved() {
    if (touches.length === 1 && isDragging) {
        // Rotation
        let deltaX = touches[0].x - lastTouchX;
        let deltaY = touches[0].y - lastTouchY;
        
        rotationY += deltaX * 0.01;
        rotationX += deltaY * 0.01;
        
        lastTouchX = touches[0].x;
        lastTouchY = touches[0].y;
    } else if (touches.length === 2) {
        // Pinch zoom
        let currentDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
        let zoomFactor = currentDist / initialPinchDist;
        targetZoom = constrain(touchStartZoom * zoomFactor, 0.3, 3.0);
    }
    
    return false; // Prevent scrolling
}

function touchEnded() {
    isDragging = false;
    return false;
}

function findClosestVertex(screenX, screenY) {
    let closest = -1;
    let minDist = 60;
    
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
    let x = worldPos.x * cos(rotationY) - worldPos.z * sin(rotationY);
    let y = worldPos.y;
    return createVector(x, y);
}

function updateUI() {
    let selectedColor = vertexColorsRGB[selectedVertex];
    if (document.getElementById('selectedIndex')) {
        document.getElementById('selectedIndex').textContent = selectedVertex;
        document.getElementById('colorInfo').textContent = 
            `RGB(${Math.round(selectedColor[0])}, ${Math.round(selectedColor[1])}, ${Math.round(selectedColor[2])})`;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Keyboard controls for testing
function keyPressed() {
    if (key === ' ') {
        // Randomize rotation
        rotationX = random(-PI, PI);
        rotationY = random(-PI, PI);
        showFeedback("🎲 Random rotation");
    } else if (key === 'r') {
        // Reset view
        rotationX = -0.5;
        rotationY = 0.8;
        zoom = 1.0;
        targetZoom = 1.0;
        showFeedback("🔄 View reset");
    }
}
