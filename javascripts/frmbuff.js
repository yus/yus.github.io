// John Conway Game of Life
let clrtable, clr, folor, cnt, cnvs, tinges;
let buff, loff, toff, w, columns, rows, board, next;
let fruit, slider;
// Click and hold a mouse button to change shapes.
// let pg;
let torusLayer;
let boxLayer;

function preload() {
  clrtable = loadTable('javascripts/colors.csv', 'csv', 'header');
}

function setup() {
  clrtable.removeColumn(0);
  console.log(clrtable.getColumnCount());
  tinges = [];
  for (let r = 0; r < clrtable.getRowCount(); r++) {
    for (let c = 0; c < clrtable.getColumnCount(); c++) {
      tinges.push(clrtable.getString(r, c));
    }
  }
  createElts();
  cnvs = createCanvas(1000, 1000);
  let sc = select('canvas');
  sc.attribute('alt', 'a graphics canvas');
  cnvs.center();
  //cnvs.size(250, 250);
  // create Graphics
  buff = createGraphics(500, 500, WEBGL);

  w = 25;
  columns = floor(buff.width / w); //cnvs
  rows = floor(buff.height / w);
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }
  next = new Array(columns);
  for (let i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  loff = (cnvs.width - buff.width) / 2;
  toff = (cnvs.height - buff.height) / 2;
  
  // Create an options object.
  let options = { width: 100, height: 100 };
  
  // Create a p5.Graphics object using WebGL mode.
  // pg = createGraphics(500, 500, WEBGL);

  // Create the p5.Framebuffer objects.
  torusLayer = buff.createFramebuffer(options);
  boxLayer = buff.createFramebuffer(options);

  init();
  describe('A grid of white toruses rotating against a dark gray background. The shapes become boxes while the user holds a mouse button.');
}

function draw() {
  // Set the framerate using the radio button.
  let rv = slider.value();
  frameRate(rv);
  
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
  buff.background(50);

  generate();
  /*
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // board
      if ((board[i][j] == 1))
      buff.fill(clr);
       else
      buff.fill(folor);
      buff.stroke(0);
      buff.square(i * w, j * w, w - 1);
      buff.image(layer, loff, toff);
    }
  }
  */
  // Iterate from left to right.
  for (let i = -250; i < 250; i += 50) {
    // Iterate from top to bottom.
    for (let j = -250; j < 250; j += 50) {
      // Draw the layer to the p5.Graphics object
      if (board[i][j] == 1) {
        buff.fill(clr);
        buff.square(i * w, j * w, w - 1);
        buff.image(layer, i, j, 50, 50);
      } else {
        buff.fill(folor);
        buff.stroke(0);
        buff.square(i * w, j * w, w - 1);
        // buff.image(layer, loff, toff);
        buff.image(layer, i, j, 50, 50);
      }
    }
  }

  // Display the p5.Graphics object.
  image(buff, 0, 0);
}

function createElts() {
  select('body').attribute('style', 'margin:0; overflow:hidden');
  cnt = createDiv('').size(windowWidth, windowHeight);
  cnt.style('background', '#222');
  // Create a slider and place it at the top of the canvas.
  slider = createSlider(1, 60, 25, 1);
  slider.position(150, 220);
  slider.size(220);
  
  let hdr = createDiv('').id('header').parent(cnt);
  select('#header').size(windowWidth, 120).position(0, 0);
  let ftr = createDiv('').id('footer').parent(cnt);
  select('#footer').size(windowWidth, 100).position(0, windowHeight - 100);
  let logo = createImg('images/yus143.png', 'yusdesign logotype');
  logo.parent('#header').position(72, 29);
  let rlgh = createA(
    'https://github.com/',
    '<img src="images/ghmarkw.png" alt="github" height="29">'
  );
  rlgh.parent('#footer').position(72, 29);
  let rl5 = createA(
    'https://processing.org',
    '<img src="images/processing.png" alt="processing" height="19">'
  );
  rl5.parent('#footer').position(129, 45);  
}

// Update and draw the torus layer offscreen.
function drawTorus() {
  // Start drawing to the torus p5.Framebuffer.
  torusLayer.begin();

  // Clear the drawing surface.
  buff.clear();

  // Turn on the lights.
  buff.lights();

  // Rotate the coordinate system.
  buff.rotateX(frameCount * 0.01);
  buff.rotateY(frameCount * 0.01);

  // Style the torus.
  buff.noStroke();

  // Draw the torus.
  buff.torus(50);

  // Start drawing to the torus p5.Framebuffer.
  torusLayer.end();
}

// Update and draw the box layer offscreen.
function drawBox() {
  // Start drawing to the box p5.Framebuffer.
  boxLayer.begin();

  // Clear the drawing surface.
  buff.clear();

  // Turn on the lights.
  buff.lights();

  // Rotate the coordinate system.
  buff.rotateX(frameCount * 0.01);
  buff.rotateY(frameCount * 0.01);

  // Style the box.
  buff.noStroke();

  // Draw the box.
  buff.box(50);

  // Start drawing to the box p5.Framebuffer.
  boxLayer.end();
}

function mouseClicked() {
  init();
}
function init() {
  colors();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1)
      board[i][j] = 0;
      // Filling the rest randomly
       else
      board[i][j] = floor(random(2));
      next[i][j] = 0;
    }
  }
}
function generate() {
  for (let x = 1; x < columns - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let neighbors = 0;
      for (let i = - 1; i <= 1; i++) {
        for (let j = - 1; j <= 1; j++) {
          neighbors += board[x + i][y + j];
        }
      }
      neighbors -= board[x][y];
      if ((board[x][y] == 1) && (neighbors < 2))
      next[x][y] = 0; // Loneliness
       else if ((board[x][y] == 1) && (neighbors > 3))
      next[x][y] = 0; // Overpopulation
       else if ((board[x][y] == 0) && (neighbors == 3))
      next[x][y] = 1; // Reproduction
       else
      next[x][y] = board[x][y]; // Stasis
    }
  }  // Swap!
  let temp = board;
  board = next;
  next = temp;
}
function colors() {
  shuffle(tinges);
  let q = floor(random(tinges.length));
  let qf = floor(random(tinges.length));
  clr = tinges[q];
  folor = tinges[qf];
}
function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = floor(random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
function windowResized() {
  cnt.size(windowWidth, windowHeight);
  //resizeCanvas(windowWidth, windowHeight - 220);
  select('#header').size(windowWidth, 120).position(0, 0);
  select('#footer').size(windowWidth, 100).position(0, windowHeight - 100);
  loff = (cnvs.width - buff.width) / 2;
  toff = (cnvs.height - buff.height) / 2;
  init();
}

/**  */
