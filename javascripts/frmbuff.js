// Click and hold a mouse button to change shapes.
let pg;
let torusLayer;
let boxLayer;

function setup() {
  let cnvs = createCanvas(500, 500);
  cnvs.center();

  // Create an options object.
  let options = { width: 100, height: 100 };
  
  // Create a p5.Graphics object using WebGL mode.
  pg = createGraphics(500, 500, WEBGL);

  // Create the p5.Framebuffer objects.
  torusLayer = pg.createFramebuffer(options);
  boxLayer = pg.createFramebuffer(options);

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
  for (let x = -250; x < 250; x += 50) {
    // Iterate from top to bottom.
    for (let y = -250; y < 250; y += 50) {
      // Draw the layer to the p5.Graphics object
      pg.image(layer, x, y, 50, 50);
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
  pg.torus(50);

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
  pg.box(50);

  // Start drawing to the box p5.Framebuffer.
  boxLayer.end();
}
