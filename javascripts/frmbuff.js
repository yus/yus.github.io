// Click and hold a mouse button to change shapes.
let pg;
let torusLayer;
let boxLayer;

function setup() {
  createCanvas(100, 100);

  // Create a p5.Graphics object using WebGL mode.
  pg = createGraphics(100, 100, WEBGL);

  // Create the p5.Framebuffer objects.
  torusLayer = pg.createFramebuffer();
  boxLayer = pg.createFramebuffer();

  describe('A grid of white toruses rotating against a dark gray background. The shapes become boxes while the user holds a mouse button.');
}

function draw() {
  // Update and draw the layers offscreen.
  drawTorus();
  drawBox();

  // Choose the layer to display.
  let layer;
  if (mouseIsPressed === true) {
    layer = boxLayer;
  } else {
    layer = torusLayer;
  }

  // Draw to the p5.Graphics object.
  pg.background(50);

  // Iterate from left to right.
  for (let x = -50; x < 50; x += 25) {
    // Iterate from top to bottom.
    for (let y = -50; y < 50; y += 25) {
      // Draw the layer to the p5.Graphics object
      pg.image(layer, x, y, 25, 25);
    }
  }

  // Display the p5.Graphics object.
  image(pg, 0, 0);
}

// Update and draw the torus layer offscreen.
function drawTorus() {
  // Start drawing to the torus p5.Framebuffer.
  torusLayer.begin();

  // Clear the drawing surface.
  pg.clear();

  // Turn on the lights.
  pg.lights();

  // Rotate the coordinate system.
  pg.rotateX(frameCount * 0.01);
  pg.rotateY(frameCount * 0.01);

  // Style the torus.
  pg.noStroke();

  // Draw the torus.
  pg.torus(20);

  // Start drawing to the torus p5.Framebuffer.
  torusLayer.end();
}

// Update and draw the box layer offscreen.
function drawBox() {
  // Start drawing to the box p5.Framebuffer.
  boxLayer.begin();

  // Clear the drawing surface.
  pg.clear();

  // Turn on the lights.
  pg.lights();

  // Rotate the coordinate system.
  pg.rotateX(frameCount * 0.01);
  pg.rotateY(frameCount * 0.01);

  // Style the box.
  pg.noStroke();

  // Draw the box.
  pg.box(30);

  // Start drawing to the box p5.Framebuffer.
  boxLayer.end();
}
