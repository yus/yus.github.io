let vertices8D = [];
let vertices3D = [];
let edges = [];
let vertexColors4D = [];
let vertexColorsRGB = [];
let selectedVertex = 0;

function setup() {
    createCanvas(800, 600, WEBGL);
    
    // 1. Generate 8D hypercube vertices (256 vertices)
    generate8DVertices();
    
    // 2. Generate edges (1024 edges)
    generateEdges();
    
    // 3. Map to 4D color space
    mapTo4DColorSpace();
    
    // 4. Project to 3D for display
    projectTo3D();
}

function generate8DVertices() {
    for (let i = 0; i < 256; i++) {
        let vertex = [];
        for (let bit = 7; bit >= 0; bit--) {
            vertex.push((i >> bit) & 1 ? 1 : -1);
        }
        vertices8D.push(vertex);
    }
}

function generateEdges() {
    for (let i = 0; i < 256; i++) {
        for (let dim = 0; dim < 8; dim++) {
            // Flip one bit to get neighbor
            let neighbor = [...vertices8D[i]];
            neighbor[dim] *= -1;
            
            // Find neighbor index
            let neighborIndex = findVertexIndex(neighbor);
            if (neighborIndex > i) {
                edges.push([i, neighborIndex]);
            }
        }
    }
}

function findVertexIndex(vertex) {
    for (let i = 0; i < 256; i++) {
        if (arraysEqual(vertices8D[i], vertex)) return i;
    }
    return -1;
}

function arraysEqual(a, b) {
    return a.every((val, idx) => val === b[idx]);
}

function mapTo4DColorSpace() {
    for (let vertex of vertices8D) {
        // Use first 4 dimensions for color (scale -1,1 to 0,1)
        let color4D = vertex.slice(0, 4).map(x => (x + 1) / 2);
        vertexColors4D.push(color4D);
        
        // Convert 4D to RGB (placeholder - replace with your IEC mapping)
        let rgb = color4DToRGB(color4D);
        vertexColorsRGB.push(rgb);
    }
}

function color4DToRGB(color4D) {
    // Placeholder: map 4D color to RGB
    // Replace with your actual IEC 4D→RGB conversion
    let [c1, c2, c3, c4] = color4D;
    
    // Example: treat as CMYK (c1,c2,c3,c4) → RGB
    let r = (1 - c1) * (1 - c4) * 255;
    let g = (1 - c2) * (1 - c4) * 255;
    let b = (1 - c3) * (1 - c4) * 255;
    
    return [r, g, b];
}

function projectTo3D() {
    // Simple projection: use first 3 coordinates for 3D position
    // (or more sophisticated 8D→3D projection)
    for (let vertex of vertices8D) {
        let scale = 200; // Visualization scale
        let x = vertex[0] * scale + vertex[4] * 50; // Use other dims for layout
        let y = vertex[1] * scale + vertex[5] * 50;
        let z = vertex[2] * scale + vertex[6] * 50;
        vertices3D.push(createVector(x, y, z));
    }
}

function draw() {
    background(0);
    orbitControl(); // Mouse rotation
    
    // Draw edges
    strokeWeight(1);
    for (let [i, j] of edges) {
        let c1 = vertexColorsRGB[i];
        let c2 = vertexColorsRGB[j];
        stroke(lerpColor(color(c1), color(c2), 0.5));
        line(vertices3D[i].x, vertices3D[i].y, vertices3D[i].z,
             vertices3D[j].x, vertices3D[j].y, vertices3D[j].z);
    }
    
    // Draw vertices
    strokeWeight(0);
    for (let i = 0; i < vertices3D.length; i++) {
        let v = vertices3D[i];
        let c = vertexColorsRGB[i];
        fill(c[0], c[1], c[2]);
        push();
        translate(v.x, v.y, v.z);
        sphere(5);
        pop();
    }
    
    // Draw selected vertex (empty circled dot)
    let selected = vertices3D[selectedVertex];
    push();
    translate(selected.x, selected.y, selected.z);
    fill(0, 0);
    stroke(255);
    strokeWeight(3);
    sphere(8);
    pop();
}

function mousePressed() {
    // Simple vertex selection (would need proper 3D picking)
    selectedVertex = (selectedVertex + 1) % vertices3D.length;
}
