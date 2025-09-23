let vertices = [];
let edges = [];
let colors = [];
let selected = 0;

let rotX = -0.5;
let rotY = 0.8;
let zoom = 1.0;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    
    // Generate 8D hypercube
    for (let i = 0; i < 256; i++) {
        let v = [];
        for (let b = 0; b < 8; b++) {
            v.push((i >> b) & 1 ? 1 : -1);
        }
        vertices.push(v);
        
        // Bright colors
        let c4d = v.slice(0, 4).map(x => (x + 1) * 0.5);
        colors.push(getRGB(c4d));
    }
    
    // Create edges
    for (let i = 0; i < 256; i++) {
        for (let b = 0; b < 8; b++) {
            let j = i ^ (1 << b);
            if (i < j) edges.push([i, j]);
        }
    }
    
    // Project to 3D
    project3D();
}

function project3D() {
    let proj = [
        [0.35,0.22,-0.18,0.41,-0.29,0.13,0.17,-0.31],
        [0.27,-0.38,0.31,0.19,0.22,-0.41,0.25,0.18],
        [-0.21,0.31,0.42,-0.25,0.33,0.19,-0.38,0.22]
    ];
    
    for (let i = 0; i < vertices.length; i++) {
        let x=0, y=0, z=0;
        for (let d = 0; d < 8; d++) {
            x += vertices[i][d] * proj[0][d];
            y += vertices[i][d] * proj[1][d];
            z += vertices[i][d] * proj[2][d];
        }
        vertices[i] = createVector(x*180, y*180, z*180);
    }
}

function getRGB(c4d) {
    let [a,b,c,d] = c4d;
    let r = (sin(a*6)*0.5+0.5)*255;
    let g = (sin(b*6+2)*0.5+0.5)*255;
    let bl = (sin(c*6+4)*0.5+0.5)*255;
    return [r,g,bl];
}

function draw() {
    background(10, 15, 30);
    
    scale(min(width,height)*0.0006*zoom);
    rotateX(rotX);
    rotateY(rotY);
    
    // Edges
    strokeWeight(1);
    for (let [i,j] of edges) {
        let c1 = colors[i], c2 = colors[j];
        stroke((c1[0]+c2[0])/2, (c1[1]+c2[1])/2, (c1[2]+c2[2])/2);
        line(vertices[i].x, vertices[i].y, vertices[i].z, 
             vertices[j].x, vertices[j].y, vertices[j].z);
    }
    
    // Vertices
    strokeWeight(2);
    for (let i = 0; i < vertices.length; i++) {
        let c = colors[i];
        stroke(c[0], c[1], c[2]);
        point(vertices[i].x, vertices[i].y, vertices[i].z);
    }
    
    // Selection
    let s = vertices[selected];
    push();
    translate(s.x, s.y, s.z);
    //noFill();
    fill(0,0,0);
    stroke(220,220,0);
    strokeWeight(1);
    circle(0,0,8);
    pop();
    
    // Update UI
    if (document.getElementById('selected')) {
        document.getElementById('selected').textContent = selected;
    }
}

// Touch controls
function touchStarted() {
    if (touches.length === 1) {
        let closest = findVertex(touches[0].x-width/2, touches[0].y-height/2);
        if (closest !== -1) selected = closest;
    }
    return false;
}

function touchMoved() {
    if (touches.length === 1) {
        rotY += (touches[0].x - pmouseX) * 0.01;
        rotX += (touches[0].y - pmouseY) * 0.01;
    }
    if (touches.length === 2) {
        let d = dist(touches[0].x,touches[0].y,touches[1].x,touches[1].y);
        let pd = dist(touches[0].px,touches[0].py,touches[1].px,touches[1].py);
        zoom *= d/pd;
        zoom = constrain(zoom, 0.3, 3);
    }
    return false;
}

function findVertex(x, y) {
    let best = -1, bestDist = 50;
    for (let i = 0; i < vertices.length; i++) {
        let sx = vertices[i].x * cos(rotY) - vertices[i].z * sin(rotY);
        let sy = vertices[i].y;
        let d = dist(x, y, sx, sy);
        if (d < bestDist) {
            bestDist = d;
            best = i;
        }
    }
    return best;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
