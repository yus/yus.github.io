// Add these global variables at the top
let baseScale = 1.0;
let isMobile = false;

// Update the setup function
function setup() {
    const container = document.getElementById('sketch-container');
    isMobile = window.innerWidth <= 768;
    
    // Calculate perfect canvas size for single-screen
    const headerHeight = document.querySelector('.header').offsetHeight;
    const footerHeight = document.querySelector('footer').offsetHeight;
    const padding = 20; // 2vmin equivalent
    
    const availableHeight = window.innerHeight - headerHeight - footerHeight - (padding * 3);
    const availableWidth = container.offsetWidth;
    
    canvas = createCanvas(availableWidth, availableHeight);
    canvas.parent('sketch-container');
    
    // Adjust base scale for different screen sizes
    baseScale = isMobile ? 0.7 : 1.0;
    
    tesseract = new Tesseract();
    setupEventListeners();
    
    strokeWeight(0.5 * baseScale);
    noLoop();
    
    // Create color sample element with scaled styles
    createColorSampleElement();
}

// Update the projectVertex function to use baseScale
projectVertex(vertex) {
    // ... existing rotation code ...
    
    const scale = Math.min(width, height) * 0.2 * scaleFactor * baseScale;
    return {
        x: x3 * scale + width / 2,
        y: y3 * scale + height / 2,
        z: z2 * scale,
        w: w2
    };
}

// Update vertex drawing with scaled sizes
function draw() {
    // ... existing code ...
    
    if (showVertices) {
        noStroke();
        projected.forEach((vertex, index) => {
            if (index === selectedVertex) {
                fill(IEC_COLORS.selected);
                drawGlow(vertex.x, vertex.y, VERTEX_DIAMETER * 2 * baseScale);
            } else {
                fill(getVertexColor(tesseract.vertices[index], index));
            }
            circle(vertex.x, vertex.y, VERTEX_DIAMETER * baseScale);
            
            if ((showLabels && index === selectedVertex) || (showLabels && index % 16 === 0)) {
                drawVertexLabel(vertex, index);
            }
        });
    }
    
    updateMetrics();
}

// Update label drawing with scaled text
function drawVertexLabel(vertex, index) {
    const name = getVertexName(tesseract.vertices[index], index);
    fill(255, 255, 255, 200);
    textSize(9 * baseScale);
    textAlign(CENTER, CENTER);
    text(name, vertex.x, vertex.y - 12 * baseScale);
    
    fill(getVertexColor(tesseract.vertices[index], index));
    rect(vertex.x - 8 * baseScale, vertex.y - 25 * baseScale, 16 * baseScale, 4 * baseScale);
}

// Add responsive window resize handler
function windowResized() {
    const container = document.getElementById('sketch-container');
    isMobile = window.innerWidth <= 768;
    baseScale = isMobile ? 0.7 : 1.0;
    
    const headerHeight = document.querySelector('.header').offsetHeight;
    const footerHeight = document.querySelector('footer').offsetHeight;
    const padding = 20;
    
    const availableHeight = window.innerHeight - headerHeight - footerHeight - (padding * 3);
    const availableWidth = container.offsetWidth;
    
    resizeCanvas(availableWidth, availableHeight);
    strokeWeight(0.5 * baseScale);
    redraw();
}

// Keep the rest of your existing sketch.js code exactly as before...
// (All the IEC naming, color samples, etc. remain unchanged)
