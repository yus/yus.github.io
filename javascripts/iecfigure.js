// IEC Hypercube Visualization - Complete Sketch.js
const IEC_COLORS = generateIECColors();
const VERTEX_DIAMETER = 5;

// IEC Naming System
const IEC_NAMING_SYSTEM = {
    categories: {
        energy: ['Quantum', 'Kinetic', 'Potential', 'Thermal', 'Radiant', 'Chemical', 'Electrical', 'Nuclear'],
        complexity: ['Simple', 'Compound', 'Composite', 'Integrated', 'Fractal', 'Chaotic', 'Harmonic', 'Resonant'],
        stability: ['Volatile', 'Dynamic', 'Balanced', 'Stable', 'Robust', 'Inert', 'Crystalline', 'Absolute'],
        dimension: ['Point', 'Linear', 'Planar', 'Volumetric', 'Temporal', 'Spatial', 'Dimensional', 'Hyper']
    },
    modifiers: {
        intensity: ['Faint', 'Subtle', 'Moderate', 'Strong', 'Intense', 'Brilliant', 'Radiant', 'Absolute'],
        phase: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'],
        quality: ['Pure', 'Mixed', 'Graded', 'Layered', 'Textured', 'Patterned', 'Structured', 'Organized']
    }
};

const IEC_COLOR_SAMPLES = generateColorSamples();

function generateIECColors() {
    const baseHue = 200;
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

function generateColorSamples() {
    const samples = [];
    const hues = [0, 30, 60, 120, 180, 240, 300, 330];
    const saturations = [60, 70, 80, 90];
    const lightnesses = [40, 50, 60, 70];
    
    let index = 0;
    for (let h = 0; h < hues.length; h++) {
        for (let s = 0; s < saturations.length; s++) {
            for (let l = 0; l < lightnesses.length; l++) {
                if (index < 256) {
                    samples.push({
                        hue: hues[h],
                        saturation: saturations[s],
                        lightness: lightnesses[l],
                        hex: hslToHex(hues[h], saturations[s], lightnesses[l]),
                        name: generateColorName(h, s, l, index)
                    });
                    index++;
                }
            }
        }
    }
    return samples;
}

function generateColorName(hIndex, sIndex, lIndex, globalIndex) {
    const cat = IEC_NAMING_SYSTEM.categories;
    const mod = IEC_NAMING_SYSTEM.modifiers;
    
    const energy = cat.energy[hIndex % cat.energy.length];
    const complexity = cat.complexity[sIndex % cat.complexity.length];
    const stability = cat.stability[lIndex % cat.stability.length];
    const dimension = cat.dimension[globalIndex % 8];
    
    const intensity = mod.intensity[sIndex];
    const phase = mod.phase[lIndex % mod.phase.length];
    const quality = mod.quality[hIndex % mod.quality.length];
    
    const nameStyles = [
        `${energy} ${complexity}`,
        `${stability} ${dimension}`,
        `${intensity} ${phase}`,
        `${quality} ${energy}`,
        `${complexity} ${stability}`,
        `${dimension} ${phase}`,
        `${energy}-${phase} ${quality}`,
        `${stability} ${complexity} ${dimension}`
    ];
    
    return nameStyles[globalIndex % nameStyles.length];
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function getVertexColor(vertex, index) {
    const colorSample = IEC_COLOR_SAMPLES[index % IEC_COLOR_SAMPLES.length];
    return `hsl(${colorSample.hue}, ${colorSample.saturation}%, ${colorSample.lightness}%)`;
}

function getVertexName(vertex, index) {
    return IEC_COLOR_SAMPLES[index % IEC_COLOR_SAMPLES.length].name;
}

function getVertexSample(vertex, index) {
    return IEC_COLOR_SAMPLES[index % IEC_COLOR_SAMPLES.length];
}

function calculateIECMetrics(vertex, index) {
    const [x, y, z, w] = vertex;
    const colorSample = getVertexSample(vertex, index);
    
    return {
        energy: (Math.sin(x * Math.PI) * 50 + 50).toFixed(1),
        complexity: (Math.cos(y * Math.PI * 2) * 30 + 50).toFixed(1),
        stability: (Math.sin(z * Math.PI * 3) * 20 + 60).toFixed(1),
        coherence: (Math.cos(w * Math.PI * 4) * 40 + 50).toFixed(1),
        hue: colorSample.hue,
        saturation: colorSample.saturation,
        lightness: colorSample.lightness,
        hex: colorSample.hex,
        name: colorSample.name
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
        
        const rx = rotation.x * Math.PI / 180;
        const ry = rotation.y * Math.PI / 180;
        const rz = rotation.z * Math.PI / 180;
        const rw = rotation.w * Math.PI / 180;
        
        let x1 = x * Math.cos(rw) - y * Math.sin(rw);
        let y1 = x * Math.sin(rw) + y * Math.cos(rw);
        
        let x2 = x1 * Math.cos(rz) - z * Math.sin(rz);
        let z1 = x1 * Math.sin(rz) + z * Math.cos(rz);
        
        let x3 = x2 * Math.cos(rw) - w * Math.sin(rw);
        let w1 = x2 * Math.sin(rw) + w * Math.cos(rw);
        
        let y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
        let z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);
        
        let y3 = y2 * Math.cos(ry) - w1 * Math.sin(ry);
        let w2 = y2 * Math.sin(ry) + w1 * Math.cos(ry);
        
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
    noLoop();
    createColorSampleElement();
}

function draw() {
    background(IEC_COLORS.background);
    
    if (autoRotate) {
        const phase = frameCount * 0.02;
        const amplitude = 80;
        const center = 180;
        
        rotation.x = Math.round(center + Math.sin(phase) * amplitude);
        rotation.y = Math.round(center + Math.sin(phase * 1.3 + 1) * amplitude);
        rotation.z = Math.round(center + Math.sin(phase * 0.7 + 2) * amplitude);
        rotation.w = Math.round(center + Math.sin(phase * 1.1 + 3) * amplitude);
        
        updateSliderValues();
    }
    
    const projected = tesseract.vertices.map(v => tesseract.projectVertex(v));
    
    stroke(IEC_COLORS.primary);
    tesseract.edges.forEach(edge => {
        const v1 = projected[edge[0]];
        const v2 = projected[edge[1]];
        line(v1.x, v1.y, v2.x, v2.y);
    });
    
    if (showVertices) {
        noStroke();
        projected.forEach((vertex, index) => {
            if (index === selectedVertex) {
                fill(IEC_COLORS.selected);
                drawGlow(vertex.x, vertex.y, VERTEX_DIAMETER * 2);
            } else {
                fill(getVertexColor(tesseract.vertices[index], index));
            }
            circle(vertex.x, vertex.y, VERTEX_DIAMETER);
            
            if ((showLabels && index === selectedVertex) || (showLabels && index % 16 === 0)) {
                drawVertexLabel(vertex, index);
            }
        });
    }
    
    updateMetrics();
}

function drawGlow(x, y, size) {
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = IEC_COLORS.selected;
    circle(x, y, size);
    drawingContext.shadowBlur = 0;
}

function drawVertexLabel(vertex, index) {
    const name = getVertexName(tesseract.vertices[index], index);
    fill(255, 255, 255, 200);
    textSize(9);
    textAlign(CENTER, CENTER);
    text(name, vertex.x, vertex.y - 12);
    
    fill(getVertexColor(tesseract.vertices[index], index));
    rect(vertex.x - 8, vertex.y - 25, 16, 4);
}

function updateMetrics() {
    if (selectedVertex !== null) {
        const metrics = calculateIECMetrics(tesseract.vertices[selectedVertex], selectedVertex);
        
        document.getElementById('vertex-count').textContent = `#${selectedVertex}`;
        document.getElementById('edge-count').textContent = metrics.name;
        document.getElementById('face-count').textContent = `${metrics.energy} Energy`;
        document.getElementById('cell-count').textContent = `${metrics.complexity} Complexity`;
        document.getElementById('hypervolume').textContent = `${metrics.stability} Stability`;
        
        updateColorSample(metrics);
        showVertexInfo(selectedVertex, metrics);
    } else {
        document.getElementById('vertex-count').textContent = '256';
        document.getElementById('edge-count').textContent = '768 Edges';
        document.getElementById('face-count').textContent = '864 Faces';
        document.getElementById('cell-count').textContent = '216 Cells';
        document.getElementById('hypervolume').textContent = '1.00 Hypervolume';
        document.getElementById('color-sample').style.display = 'none';
        document.getElementById('vertex-info').style.display = 'none';
    }
}

function updateColorSample(metrics) {
    const sample = document.getElementById('color-sample');
    sample.innerHTML = `
        <div class="color-display" style="background: ${metrics.hex}"></div>
        <div class="color-info">
            <div class="color-name">${metrics.name}</div>
            <div class="color-values">HSL(${metrics.hue}, ${metrics.saturation}%, ${metrics.lightness}%)</div>
            <div class="color-hex">${metrics.hex}</div>
        </div>
    `;
    sample.style.display = 'block';
}

function createColorSampleElement() {
    const metricsPanel = document.querySelector('.metrics-panel');
    const colorSample = document.createElement('div');
    colorSample.id = 'color-sample';
    colorSample.style.cssText = `
        display: none;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        padding: 15px;
        margin-top: 15px;
        display: flex;
        align-items: center;
        gap: 15px;
    `;
    
    colorSample.innerHTML = `
        <div class="color-display" style="width: 60px; height: 60px; border-radius: 6px; border: 2px solid #333;"></div>
        <div class="color-info">
            <div class="color-name" style="color: #4fc3f7; font-weight: bold; margin-bottom: 5px;"></div>
            <div class="color-values" style="color: #90a4ae; font-size: 0.8rem; margin-bottom: 3px;"></div>
            <div class="color-hex" style="color: #b0b0b0; font-family: monospace; font-size: 0.9rem;"></div>
        </div>
    `;
    
    metricsPanel.appendChild(colorSample);
}

function setupEventListeners() {
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
        loop();
    } else {
        noLoop();
        redraw();
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
