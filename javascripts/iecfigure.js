// IEC Color Scheme from yus.github.io/iec.html
const IEC_COLORS = {
    primary: '#4fc3f7',      // Light blue
    secondary: '#29b6f6',    // Medium blue  
    accent: '#01579b',       // Dark blue
    background: '#000011',    // Dark blue-black
    grid: '#1a237e',         // Grid blue
    vertex: '#e3f2fd',       // Light blue-white
    selected: '#ff5252',     // Red for selection
    text: '#e0e0e0'          // Light gray
};

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
        // Create 4x4x4x4 grid (256 vertices)
        const subdivisions = 4;
        
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

        // Create edges for 4D grid
        for (let i = 0; i < this.vertices.length; i++) {
            const coords = this.getGridCoordinates(i, subdivisions);
            
            // Check neighbors in 4 dimensions
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
        return w * Math.pow(subdivisions, 3) + 
               z * Math.pow(subdivisions, 2) + 
               y * subdivisions + 
               x;
    }

    projectVertex(vertex, canvasWidth, canvasHeight) {
        let [x, y, z, w] = vertex;
        
        // Apply 4D rotations
        this.rotate4D([x, y, z, w], rotation);
        
        // Perspective projection from 4D to 3D
        const depth = perspective;
        const factor = depth / (depth - w);
        x *= factor;
        y *= factor;
        z *= factor;
        
        // Scale to canvas
        const scale = Math.min(canvasWidth, canvasHeight) * 0.15 * scaleFactor;
        return {
            x: x * scale + canvasWidth / 2,
            y: y * scale + canvasHeight / 2,
            z: z * scale,
            w: w
        };
    }

    rotate4D(vertex, angles) {
        let [x, y, z, w] = vertex;
        
        // Convert degrees to radians
        const rx = angles.x * Math.PI / 180;
        const ry = angles.y * Math.PI / 180;
        const rz = angles.z * Math.PI / 180;
        const rw = angles.w * Math.PI / 180;
        
        // XY rotation
        const xy = [x * Math.cos(rw) - y * Math.sin(rw), 
                   x * Math.sin(rw) + y * Math.cos(rw), z, w];
        
        // XZ rotation  
        const xz = [xy[0] * Math.cos(rz) - xy[2] * Math.sin(rz),
                   xy[1], xy[0] * Math.sin(rz) + xy[2] * Math.cos(rz), xy[3]];
        
        // XW rotation
        const xw = [xz[0] * Math.cos(rw) - xz[3] * Math.sin(rw),
                   xz[1], xz[2], xz[0] * Math.sin(rw) + xz[3] * Math.cos(rw)];
        
        // YZ rotation
        const yz = [xw[0], xw[1] * Math.cos(rx) - xw[2] * Math.sin(rx),
                   xw[1] * Math.sin(rx) + xw[2] * Math.cos(rx), xw[3]];
        
        return yz;
    }
}

function setup() {
    const container = document.getElementById('sketch-container');
    canvas = createCanvas(container.offsetWidth, 600);
    canvas.parent('sketch-container');
    
    tesseract = new Tesseract();
    setupEventListeners();
    
    // Set IEC color scheme
    strokeWeight(0.5); // Edges stroke weight as requested
}

function draw() {
    background(IEC_COLORS.background);
    
    if (autoRotate) {
        // Wave-like pendulum motion for all axes
        const phase = frameCount * 0.01;
        rotation.x = sin(phase) * 25;
        rotation.y = sin(phase * 1.3 + 1) * 20;
        rotation.z = sin(phase * 0.7 + 2) * 15;
        rotation.w = sin(phase * 1.1 + 3) * 30;
        
        updateSliderValues();
    }
    
    // Project all vertices
    const projected = tesseract.vertices.map(v => 
        tesseract.projectVertex(v, width, height)
    );
    
    // Draw edges with IEC primary color
    stroke(IEC_COLORS.primary);
    tesseract.edges.forEach(edge => {
        const v1 = projected[edge[0]];
        const v2 = projected[edge[1]];
        line(v1.x, v1.y, v2.x, v2.y);
    });
    
    // Draw vertices with diameter 15 as requested
    if (showVertices) {
        noStroke();
        projected.forEach((vertex, index) => {
            if (index === selectedVertex) {
                fill(IEC_COLORS.selected);
            } else {
                fill(IEC_COLORS.vertex);
            }
            circle(vertex.x, vertex.y, 15); // Diameter 15 as requested
            
            if (showLabels) {
                fill(IEC_COLORS.text);
                textSize(10);
                textAlign(CENTER, CENTER);
                text(index, vertex.x, vertex.y);
            }
        });
    }
    
    // Show vertex info if selected
    if (selectedVertex !== null) {
        showVertexInfo(selectedVertex);
    }
}

function setupEventListeners() {
    // Rotation sliders
    ['x', 'y', 'z', 'w'].forEach(axis => {
        const slider = document.getElementById(`rotation-${axis}`);
        slider.addEventListener('input', (e) => {
            rotation[axis] = parseInt(e.target.value);
            document.getElementById(`rotation-${axis}-value`).textContent = `${rotation[axis]}°`;
        });
    });
    
    // Scale slider
    document.getElementById('scale').addEventListener('input', (e) => {
        scaleFactor = parseInt(e.target.value) / 100;
        document.getElementById('scale-value').textContent = `${e.target.value}%`;
    });
    
    // Perspective slider  
    document.getElementById('perspective').addEventListener('input', (e) => {
        perspective = parseFloat(e.target.value);
        document.getElementById('perspective-value').textContent = perspective.toFixed(1);
    });
    
    // Buttons
    document.getElementById('reset-view').addEventListener('click', resetView);
    document.getElementById('auto-rotate').addEventListener('click', toggleAutoRotate);
    document.getElementById('toggle-vertices').addEventListener('click', toggleVertices);
    document.getElementById('toggle-labels').addEventListener('click', toggleLabels);
    
    // Canvas click for vertex selection
    canvas.mousePressed(handleCanvasClick);
}

function handleCanvasClick() {
    const projected = tesseract.vertices.map(v => 
        tesseract.projectVertex(v, width, height)
    );
    
    let minDist = 25; // Click radius for diameter 15 circles
    let closest = null;
    
    projected.forEach((vertex, index) => {
        const dist = dist(mouseX, mouseY, vertex.x, vertex.y);
        if (dist < minDist) {
            minDist = dist;
            closest = index;
        }
    });
    
    selectedVertex = closest;
}

function showVertexInfo(vertexIndex) {
    const info = document.getElementById('vertex-info');
    if (vertexIndex === null) {
        info.style.display = 'none';
        return;
    }
    
    const vertex = tesseract.vertices[vertexIndex];
    info.innerHTML = `
        <strong>Vertex ${vertexIndex}</strong><br>
        Coordinates: (${vertex.map(v => v.toFixed(2)).join(', ')})
    `;
    info.style.display = 'block';
}

function resetView() {
    rotation = { x: 0, y: 0, z: 0, w: 0 };
    scaleFactor = 1.0;
    perspective = 4.0;
    selectedVertex = null;
    updateSliderValues();
}

function toggleAutoRotate() {
    autoRotate = !autoRotate;
    const button = document.getElementById('auto-rotate');
    button.textContent = autoRotate ? 'Stop Rotation' : 'Auto Rotate';
    button.classList.toggle('active', autoRotate);
}

function toggleVertices() {
    showVertices = !showVertices;
    const button = document.getElementById('toggle-vertices');
    button.textContent = showVertices ? 'Hide Vertices' : 'Show Vertices';
    button.classList.toggle('active', showVertices);
}

function toggleLabels() {
    showLabels = !showLabels;
    const button = document.getElementById('toggle-labels');
    button.textContent = showLabels ? 'Hide Labels' : 'Show Labels';
    button.classList.toggle('active', showLabels);
}

function updateSliderValues() {
    ['x', 'y', 'z', 'w'].forEach(axis => {
        document.getElementById(`rotation-${axis}`).value = rotation[axis];
        document.getElementById(`rotation-${axis}-value`).textContent = `${rotation[axis]}°`;
    });
    
    document.getElementById('scale').value = scaleFactor * 100;
    document.getElementById('scale-value').textContent = `${Math.round(scaleFactor * 100)}%`;
    
    document.getElementById('perspective').value = perspective;
    document.getElementById('perspective-value').textContent = perspective.toFixed(1);
}

function windowResized() {
    const container = document.getElementById('sketch-container');
    resizeCanvas(container.offsetWidth, 600);
}
