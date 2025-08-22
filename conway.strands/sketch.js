let grid = [];
let nextGrid = [];
let cols = 12;
let rows = 12;
let cellSize = 10;
let gapSize = 5;
let isPlaying = true;
let speed = 10;
let frameCount = 0;
let colorMode = 'pair';
let shouldAnimate = false;
let rotationAngles = [];
let cameraState = {
    position: [0, 0, 800],
    center: [0, 0, 0],
    up: [0, 1, 0]
};
let cameraZoom = 1;
let hairlineShader;

function preload() {
    // Simple shader for hairline rendering
    hairlineShader = loadShader('hairline.vert', 'hairline.frag');
}

// Color dataset
const colorDataset = [
    [255, 0, 0, 200], [0, 255, 0, 200], [0, 0, 255, 200], [255, 255, 0, 200],
    [0, 255, 255, 200], [255, 0, 255, 200], [255, 165, 0, 200], [128, 0, 128, 200],
    [0, 128, 128, 200], [128, 128, 0, 200], [75, 0, 130, 200], [139, 69, 19, 200],
    [0, 100, 0, 200], [72, 61, 139, 200], [47, 79, 79, 200], [148, 0, 211, 200]
];

// Predefined palettes
const palettes = [
    [[255, 0, 0, 200], [0, 255, 0, 200], [0, 0, 255, 200], [255, 255, 0, 200]],
    [[255, 105, 180, 200], [173, 216, 230, 200], [152, 251, 152, 200], [255, 255, 0, 200]],
    [[70, 130, 180, 200], [255, 215, 0, 200], [255, 69, 0, 200], [0, 128, 0, 200]],
    [[138, 43, 226, 200], [75, 0, 130, 200], [0, 0, 139, 200], [0, 191, 255, 200]]
];

let currentColors = [];
let bgColors = [];

function setup() {
    let canvas = createCanvas(600, 600, WEBGL);
    canvas.parent('canvas-container');

    // Set orthographic projection
    ortho(-width/2, width/2, -height/2, height/2, 0, 2000);

    // Initialize grids and rotations
    initGrids();
    initRotationAngles();
    setupControls();
    updateColors();
    randomizeGrid();

    // Set WEBGL settings
    angleMode(DEGREES);
    // Create a graphics buffer for offscreen rendering
    buffer = createGraphics(width, height, WEBGL);
}

function draw() {
    // Render to buffer first
    buffer.push();
    buffer.background(255);

    // Calculate and set stroke weight for buffer
    calculateCameraZoom();
    let strokeWeightValue = 1 / cameraZoom;
    buffer.strokeWeight(strokeWeightValue);
    buffer.stroke(0);

    // background(255);

    // Calculate camera zoom for hairline strokes
    calculateCameraZoom();

    // Set stroke weight based on zoom (hairline effect)
    let strokeWeightValue = 1 / cameraZoom;
    strokeWeight(strokeWeightValue);
    stroke(0);

    // Set camera position
    if (shouldAnimate) {
        orbitControl();
    } else {
        camera(...cameraState.position, ...cameraState.center, ...cameraState.up);
    }

    // Lighting
    ambientLight(60);
    pointLight(255, 255, 255, -200, -200, 200);

    // Position the grid
    let totalSize = cols * (cellSize + gapSize) - gapSize;
    translate(-totalSize/2, -totalSize/2, 0);

    // Update simulation at controlled speed
    if (isPlaying && frameCount % (31 - speed) === 0) {
        updateGrid();
    }

    // Draw the 3D grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            push();
            translate(i*(cellSize+gapSize)+cellSize/2, j*(cellSize+gapSize)+cellSize/2, 0);

            if (shouldAnimate) {
                rotateX(rotationAngles[i][j].x);
                rotateY(rotationAngles[i][j].y);
                rotateZ(rotationAngles[i][j].z);

                // Update rotation angles
                rotationAngles[i][j].x += 0.5;
                rotationAngles[i][j].y += 0.7;
                rotationAngles[i][j].z += 0.3;
            }

            if (grid[i][j] === 1) {
                // Draw live cell (cube)
                if (colorMode === 'pair') {
                    fill(currentColors[0]);
                } else if (colorMode === 'palette') {
                    fill(currentColors[(i + j) % currentColors.length]);
                } else { // random
                    fill(255, 255, 255, 200);
                }
                box(cellSize);
            } else {
                // Draw dead cell (transparent cube)
                if (colorMode === 'random') {
                    fill(bgColors[i][j]);
                } else {
                    fill(100, 100, 100, 50);
                }
                box(cellSize);
            }
            // pop();
            // ... rest of your drawing code but using buffer instead of global functions

            buffer.pop();

            // Render buffer to screen with shader for perfect hairlines
            shader(hairlineShader);
            texture(buffer);
            rect(-width/2, -height/2, width, height);
            //////////////////
        }
    }

    frameCount++;
}

function calculateCameraZoom() {
    // Calculate approximate camera zoom for hairline stroke adjustment
    // This is a simplified calculation - you might need to adjust based on your exact camera setup
    if (shouldAnimate) {
        // When orbiting, we need to estimate the zoom level
        // This is an approximation - you might need a more precise method
        let camDistance = dist(0, 0, 0, cameraX, cameraY, cameraZ);
        cameraZoom = camDistance / 800; // 800 is our default camera distance
    } else {
        // In orthographic mode, zoom is constant
        cameraZoom = 1;
    }

    // Ensure minimum stroke weight
    cameraZoom = max(cameraZoom, 0.1);
}

function initGrids() {
    for (let i = 0; i < cols; i++) {
        grid[i] = [];
        nextGrid[i] = [];
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function initRotationAngles() {
    rotationAngles = [];
    for (let i = 0; i < cols; i++) {
        rotationAngles[i] = [];
        for (let j = 0; j < rows; j++) {
            rotationAngles[i][j] = {
                x: random(360),
                y: random(360),
                z: random(360)
            };
        }
    }
}

function setupControls() {
    document.getElementById('speed').addEventListener('input', function() {
        speed = parseInt(this.value);
    });

    document.getElementById('colorMode').addEventListener('change', function() {
        colorMode = this.value;
        updateColors();
    });

    document.getElementById('randomize').addEventListener('click', function() {
        randomizeGrid();
        if (shouldAnimate) {
            initRotationAngles();
        }
    });

    document.getElementById('save').addEventListener('click', function() {
        saveCanvas('3d-conway', 'png');
    });

    document.getElementById('playPause').addEventListener('click', function() {
        isPlaying = !isPlaying;
        this.textContent = isPlaying ? 'Pause' : 'Play';
    });

    document.getElementById('resetView').addEventListener('click', function() {
        gapSize = 0;
        shouldAnimate = false;
        shouldAnimate.checked = false;
        resetCamera();
    });

    document.getElementById('animate').addEventListener('change', function() {
        shouldAnimate = this.checked;
        gapSize = 10;
        if (!shouldAnimate) {
            resetCamera();
        }
    });
}

function resetCamera() {
    cameraState.position = [0, 0, 800];
    cameraState.center = [0, 0, 0];
    cameraState.up = [0, 1, 0];
    cameraZoom = 1; // Reset zoom calculation
}

function updateGrid() {
    // Compute next generation
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];
            let neighbors = countNeighbors(i, j);

            // Apply Conway's rules
            if (state === 0 && neighbors === 3) {
                nextGrid[i][j] = 1;
            } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                nextGrid[i][j] = 0;
            } else {
                nextGrid[i][j] = state;
            }
        }
    }

    // Swap grids
    [grid, nextGrid] = [nextGrid, grid];
}

function countNeighbors(x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            // Wrap around edges
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;

            sum += grid[col][row];
        }
    }
    sum -= grid[x][y]; // Subtract self
    return sum;
}

function randomizeGrid() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = random() > 0.7 ? 1 : 0;
        }
    }
    updateColors();
}

function updateColors() {
    if (colorMode === 'pair') {
        // Select 2 random colors from dataset
        shuffleArray(colorDataset);
        currentColors = [colorDataset[0], colorDataset[1]];
    } else if (colorMode === 'palette') {
        // Select a random palette
        currentColors = random(palettes);
    } else { // random
        // Generate random colors for all cells
        bgColors = [];
        for (let i = 0; i < cols; i++) {
            bgColors[i] = [];
            for (let j = 0; j < rows; j++) {
                shuffleArray(colorDataset);
                bgColors[i][j] = colorDataset[0];
            }
        }
    }
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
