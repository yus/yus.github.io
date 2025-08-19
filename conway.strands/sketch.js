let grid;
let cols = 12;
let rows = 12;
let cellSize = 10;
let isPlaying = true;
let speed = 10;
let frameCount = 0;
let colorMode = 'pair';

// Color dataset - you can expand this with more colors
const colorDataset = [
    [255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0],
    [0, 255, 255], [255, 0, 255], [255, 165, 0], [128, 0, 128],
    [0, 128, 128], [128, 128, 0], [75, 0, 130], [139, 69, 19],
    [0, 100, 0], [72, 61, 139], [47, 79, 79], [148, 0, 211]
];

// Predefined palettes
const palettes = [
    [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0]],
    [[255, 105, 180], [173, 216, 230], [152, 251, 152], [255, 255, 0]],
    [[70, 130, 180], [255, 215, 0], [255, 69, 0], [0, 128, 0]],
    [[138, 43, 226], [75, 0, 130], [0, 0, 139], [0, 191, 255]]
];

let currentColors = [];
let bgColors = [];

function setup() {
    let canvas = createCanvas(cols * cellSize, rows * cellSize);
    canvas.parent('canvas-container');

    // Initialize grid with p5.strands
    grid = new Strands.Grid(cols, rows);
    grid.init(0);

    // Initialize UI controls
    document.getElementById('speed').addEventListener('input', function() {
        speed = parseInt(this.value);
    });

    document.getElementById('colorMode').addEventListener('change', function() {
        colorMode = this.value;
        updateColors();
    });

    document.getElementById('randomize').addEventListener('click', function() {
        randomizeGrid();
    });

    document.getElementById('save').addEventListener('click', function() {
        saveCanvas('conway-art', 'png');
    });

    document.getElementById('playPause').addEventListener('click', function() {
        isPlaying = !isPlaying;
        this.textContent = isPlaying ? 'Pause' : 'Play';
    });

    // Initialize colors
    updateColors();
    randomizeGrid();
}

function draw() {
    background(240);

    // Update simulation at controlled speed
    if (isPlaying && frameCount % (31 - speed) === 0) {
        updateGrid();
    }

    // Draw grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * cellSize;
            let y = j * cellSize;

            // Draw background cell
            if (colorMode === 'random') {
                fill(bgColors[i][j]);
            } else {
                fill(200);
            }
            stroke(180);
            rect(x, y, cellSize, cellSize);

            // Draw live cell
            if (grid.get(i, j) === 1) {
                noStroke();
                if (colorMode === 'pair') {
                    fill(currentColors[0]);
                } else if (colorMode === 'palette') {
                    fill(currentColors[(i + j) % currentColors.length]);
                } else { // random
                    fill(255); // white for live cells in random mode
                }
                rect(x, y, cellSize, cellSize);
            }
        }
    }

    frameCount++;
}

function updateGrid() {
    let nextGrid = new Strands.Grid(cols, rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid.get(i, j);
            let neighbors = countNeighbors(i, j);

            // Apply Conway's rules
            if (state === 0 && neighbors === 3) {
                nextGrid.set(i, j, 1);
            } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                nextGrid.set(i, j, 0);
            } else {
                nextGrid.set(i, j, state);
            }
        }
    }

    grid = nextGrid;
}

function countNeighbors(x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            // Wrap around edges
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;

            sum += grid.get(col, row);
        }
    }
    sum -= grid.get(x, y); // Subtract self
    return sum;
}

function randomizeGrid() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid.set(i, j, random() > 0.7 ? 1 : 0);
        }
    }
    updateColors();
}

function updateColors() {
    if (colorMode === 'pair') {
        // Select 2 random colors from dataset
        let shuffled = shuffleArray([...colorDataset]);
        currentColors = [shuffled[0], shuffled[1]];
    } else if (colorMode === 'palette') {
        // Select a random palette
        currentColors = random(palettes);
    } else { // random
        // Generate random colors for all cells
        bgColors = [];
        for (let i = 0; i < cols; i++) {
            bgColors[i] = [];
            for (let j = 0; j < rows; j++) {
                bgColors[i][j] = random(colorDataset);
            }
        }
    }
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
