// IEC Color Scheme from yus.github.io/iec.html with dynamic generation
const IEC_COLORS = generateIECColors();
const VERTEX_DIAMETER = 5; // 3x smaller than 15 as requested

function generateIECColors() {
    // Dynamic color generation similar to yus.github.io/colors.html
    const baseHue = 200; // Blue base
    return {
        primary: `hsl(${baseHue}, 80%, 60%)`,
        secondary: `hsl(${baseHue + 20}, 70%, 50%)`,
        accent: `hsl(${baseHue - 20}, 90%, 40%)`,
        background: '#000011',
        grid: `hsl(${baseHue}, 60%, 20%)`,
        vertex: `hsl(${baseHue}, 30%, 85%)`,
        selected: '#ff5252',
        text: '#e0e0e0'
    };
}

// Vertex coloring formulas from IEC metrics
function getVertexColor(vertex, index) {
    const [x, y, z, w] = vertex;
    
    // IEC metric formulas for vertex coloring
    const energy = (Math.sin(x * 2 * Math.PI) + 1) * 50;
    const complexity = (Math.cos(y * 3 * Math.PI) + 1) * 40;
    const stability = (Math.sin(z * 4 * Math.PI) + 1) * 60;
    
    // Combine metrics for color generation
    const hue = (energy + complexity) % 360;
    const saturation = 70 + stability * 0.3;
    const lightness = 50 + energy * 0.2;
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function calculateIECMetrics(vertex, index) {
    const [x, y, z, w] = vertex;
    
    return {
        energy: Math.abs(x * y * 100).toFixed(1),
        complexity: Math.abs((x + y + z) * 50).toFixed(1),
        stability: Math.abs(w * 75).toFixed(1),
        coherence: Math.abs((x * y * z * w) * 200).toFixed(1)
    };
}

let tesseract;
let canvas;
let rotation = { x: 0, y: 0, z: 0, w: 0 };
let autoRotate = false;
let showVertices = true;
let showLabels = false;
let scaleFactor = 1.0;
let perspective = 4.0;
let selectedVertex = null;

class Tesseract {
    constructor() {
        this.vertices = [];
        this.edges = [];
        this.initialize256VertexTesseract();
    }

    initialize256VertexTesseract() {
        const subdivisions = 4;
        this.vertices = [];
        
        for (let w = 0; w < subdivisions; w++) {
            for (let z = 0; z < subdivisions; z++) {
                for (let y = 0; y < subdivisions; y++) {
                    for (let x = 0; x < subdivisions; x++) {
                        this.vertices.push([
                            (x / (subdivisions - 1) - 0.5) * 2,
                            (y / (subdivisions - 1) - 0.5) * 2,
                            (z / (subdivisions - 1) - 0.5) * 2,
                            (w / (subdivisions - 1) - 0.5) * 2
                        ]);
                    }
                }
            }
        }

        // Create edges
        this.edges = [];
        for (let i = 0; i < this.vertices.length; i++) {
            const coords = this.getGridCoordinates(i, subdivisions);
            
            for (let dim = 0; dim < 4; dim++) {
                if (coords[dim] < subdivisions - 1) {
                    const neighborCoords = [...coords];
                    neighborCoords[dim]++;
                    const neighborIndex = this.getGridIndex(neighborCoords, subdivisions);
                    this.edges.push([i, neighborIndex]);
                }
            }
        }
    }

    getGridCoordinates(index, subdivisions) {
        const w = Math.floor(index / Math.pow(subdivisions, 3));
        const remainder = index % Math.pow(subdivisions, 3);
        const z = Math.floor(remainder / Math.pow(subdivisions, 2));
        const remainder2 = remainder % Math.pow(subdivisions, 2);
        const y = Math.floor(remainder2 / subdivisions);
        const x = remainder2 % subdivisions;
        return [x, y, z, w];
    }

    getGridIndex(coords, subdivisions) {
        const [x, y, z, w] = coords;
        return w * Math.pow(subdivisions, 3) + z * Math.pow(subdivisions, 2) + y * subdivisions + x;
    }

    projectVertex(vertex) {
        let [x, y, z, w] = vertex;
        
        // Apply 4D rotations with proper matrix math
        const rx = rotation.x * Math.PI / 180;
        const ry = rotation.y * Math.PI / 180;
        const rz = rotation.z * Math.PI / 180;
        const rw = rotation.w * Math.PI / 180;
        
        // XY rotation
        let x1 = x * Math.cos(rw) - y * Math.sin(rw);
        let y1 = x * Math.sin(rw) + y * Math.cos(rw);
        
        // XZ rotation
        let x2 = x1 * Math.cos(rz) - z * Math.sin(rz);
        let z1 = x1 * Math.sin(rz) + z * Math.cos(rz);
        
        // XW rotation
        let x3 = x2 * Math.cos(rw) - w * Math.sin(rw);
        let w1 = x2 * Math.sin(rw) + w * Math.cos(rw);
        
        // YZ rotation
        let y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
        let z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);
        
        // YW rotation
        let y3 = y2 * Math.cos(ry) - w1 * Math.sin(ry);
        let w2 = y2 * Math.sin(ry) + w1 * Math.cos(ry);
        
        // Perspective projection
        const depth = perspective;
        const factor = depth / (depth - w2);
        x3 *= factor;
        y3 *= factor;
        z2 *= factor;
        
        const scale = Math.min(width, height) * 0.2 * scaleFactor;
        return {
            x: x3 * scale + width / 2,
            y: y3 * scale + height / 2,
            z: z2 * scale,
            w: w2
        };
    }
}

function setup() {
    const container = document.getElementById('sketch-container');
    canvas = createCanvas(container.offsetWidth, 600);
    canvas.parent('sketch-container');
    
    tesseract = new Tesseract();
    setupEventListeners();
    
    strokeWeight(0.5);
    noLoop(); // Start paused until we need animation
}

function draw() {
    background(IEC_COLORS.background);
    
    if (autoRotate) {
        // Complete wave motion centered around 180° with margins
        const phase = frameCount * 0.02;
        const amplitude = 80; // Reduced range for better visibility
        const center = 180;
        
        rotation.x = center + Math.sin(phase) * amplitude;
        rotation.y = center + Math.sin(phase * 1.3 + 1) * amplitude;
        rotation.z = center + Math.sin(phase * 0.7 + 2) * amplitude;
        rotation.w = center + Math.sin(phase * 1.1 + 3) * amplitude;
        
        // Round to integers to prevent layout issues
        rotation.x = Math.round(rotation.x);
        rotation.y = Math.round(rotation.y);
        rotation.z = Math.round(rotation.z);
        rotation.w = Math.round(rotation.w);
        
        updateSliderValues();
    }
    
    const projected = tesseract.vertices.map(v => tesseract.projectVertex(v));
    
    // Draw edges
    stroke(IEC_COLORS.primary);
    tesseract.edges.forEach(edge => {
        const v1 = projected[edge[0]];
        const v2 = projected[edge[1]];
        line(v1.x, v1.y, v2.x, v2.y);
    });
    
    // Draw vertices with IEC coloring
    if (showVertices) {
        noStroke();
        projected.forEach((vertex, index) => {
            if (index === selectedVertex) {
                fill(IEC_COLORS.selected);
            } else {
                fill(getVertexColor(tesseract.vertices[index], index));
            }
            circle(vertex.x, vertex.y, VERTEX_DIAMETER);
            
            if (showLabels && index === selectedVertex) {
                fill(IEC_COLORS.text);
                textSize(10);
                textAlign(CENTER, CENTER);
                text(index, vertex.x, vertex.y - 10);
            }
        });
    }
    
    updateMetrics();
}

function updateMetrics() {
    // Update main metrics
    document.getElementById('vertex-count').textContent = tesseract.vertices.length;
    document.getElementById('edge-count').textContent = tesseract.edges.length;
    
    // Update selected vertex metrics
    if (selectedVertex !== null) {
        const metrics = calculateIECMetrics(tesseract.vertices[selectedVertex], selectedVertex);
        document.getElementById('face-count').textContent = metrics.energy;
        document.getElementById('cell-count').textContent = metrics.complexity;
        document.getElementById('hypervolume').textContent = metrics.stability;
        
        // Show vertex info
        showVertexInfo(selectedVertex, metrics);
    } else {
        document.getElementById('face-count').textContent = '864';
        document.getElementById('cell-count').textContent = '216';
        document.getElementById('hypervolume').textContent = '1.00';
        document.getElementById('vertex-info').style.display = 'none';
    }
}

function setupEventListeners() {
    // Rotation sliders with integer values only
    ['x', 'y', 'z', 'w'].forEach(axis => {
        const slider = document.getElementById(`rotation-${axis}`);
        const display = document.getElementById(`rotation-${axis}-value`);
        
        slider.addEventListener('input', (e) => {
            rotation[axis] = parseInt(e.target.value);
            display.textContent = `${rotation[axis]}°`;
            redraw();
        });
    });
    
    document.getElementById('scale').addEventListener('input', (e) => {
        scaleFactor = parseInt(e.target.value) / 100;
        document.getElementById('scale-value').textContent = `${e.target.value}%`;
        redraw();
    });
    
    document.getElementById('perspective').addEventListener('input', (e) => {
        perspective = parseFloat(e.target.value);
        document.getElementById('perspective-value').textContent = perspective.toFixed(1);
        redraw();
    });
    
    document.getElementById('reset-view').addEventListener('click', resetView);
    document.getElementById('auto-rotate').addEventListener('click', toggleAutoRotate);
    document.getElementById('toggle-vertices').addEventListener('click', toggleVertices);
    document.getElementById('toggle-labels').addEventListener('click', toggleLabels);
    
    canvas.mousePressed(handleCanvasClick);
}

function handleCanvasClick() {
    const projected = tesseract.vertices.map(v => tesseract.projectVertex(v));
    
    let minDist = 20;
    let closest = null;
    
    projected.forEach((vertex, index) => {
        const d = dist(mouseX, mouseY, vertex.x, vertex.y);
        if (d < minDist) {
            minDist = d;
            closest = index;
        }
    });
    
    selectedVertex = closest;
    redraw();
}

function showVertexInfo(vertexIndex, metrics) {
    const info = document.getElementById('vertex-info');
    const vertex = tesseract.vertices[vertexIndex];
    
    info.innerHTML = `
        <strong>Vertex ${vertexIndex}</strong><br>
        Coordinates: (${vertex.map(v => v.toFixed(2)).join(', ')})<br>
        Energy: ${metrics.energy}<br>
        Complexity: ${metrics.complexity}<br>
        Stability: ${metrics.stability}<br>
        Coherence: ${metrics.coherence}
    `;
    info.style.display = 'block';
}

function resetView() {
    rotation = { x: 0, y: 0, z: 0, w: 0 };
    scaleFactor = 1.0;
    perspective = 4.0;
    selectedVertex = null;
    updateSliderValues();
    redraw();
}

function toggleAutoRotate() {
    autoRotate = !autoRotate;
    const button = document.getElementById('auto-rotate');
    button.textContent = autoRotate ? 'Stop Rotation' : 'Auto Rotate';
    button.classList.toggle('active', autoRotate);
    
    if (autoRotate) {
        loop(); // Start animation
    } else {
        noLoop(); // Stop animation
        redraw(); // Draw one frame
    }
}

function toggleVertices() {
    showVertices = !showVertices;
    const button = document.getElementById('toggle-vertices');
    button.textContent = showVertices ? 'Hide Vertices' : 'Show Vertices';
    button.classList.toggle('active', showVertices);
    redraw();
}

function toggleLabels() {
    showLabels = !showLabels;
    const button = document.getElementById('toggle-labels');
    button.textContent = showLabels ? 'Hide Labels' : 'Show Labels';
    button.classList.toggle('active', showLabels);
    redraw();
}

function updateSliderValues() {
    ['x', 'y', 'z', 'w'].forEach(axis => {
        const slider = document.getElementById(`rotation-${axis}`);
        const display = document.getElementById(`rotation-${axis}-value`);
        slider.value = rotation[axis];
        display.textContent = `${rotation[axis]}°`;
    });
    
    document.getElementById('scale').value = scaleFactor * 100;
    document.getElementById('scale-value').textContent = `${Math.round(scaleFactor * 100)}%`;
    
    document.getElementById('perspective').value = perspective;
    document.getElementById('perspective-value').textContent = perspective.toFixed(1);
}

function windowResized() {
    const container = document.getElementById('sketch-container');
    resizeCanvas(container.offsetWidth, 600);
    redraw();
}
