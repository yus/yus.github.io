let clrtable, clr, folor, cnt, cnvs, tinges;
let buff, loff, toff, w, columns, rows, board, next;
let fruit, slider;
let layer;

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
  
  select('body').attribute('style', 'margin:0; overflow:hidden');
  cnt = createDiv('').size(windowWidth, windowHeight);
  cnt.style('background', '#222');

  cnvs = createCanvas(windowWidth, windowHeight - 220, WEBGL);
  let sc = select('canvas');
  sc.attribute('alt', 'a graphics canvas');
  cnvs.parent(cnt).position(0, 120).background(52);

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
 
  // buff layer
  buff = createFramebuffer();
  describe('a rotating cube with Game of Life on each face');

  init();
}

function draw() {
  let t = millis() * 0.001;

  // Start drawing to the framebuffer
  buff.begin();

  clear();
 
  lights();
  background(52);
  lights();

  rotateX(t/TAU);
  rotateY(t/TAU);
  box(min(width/2, height/2));

  buff.end();
  // Draw the layer to the main canvas
  clear();
  translate(-width/2, -height/2);
  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if ((board[i][j] == 1))
      fill(clr);
       else
      fill(folor);
      stroke(52);
      square(i * w, j * w, w - 1);
      image(buff, loff, toff);
    }
  }
}
function mouseClicked() {
  init();
}
function init() {
  w = 24;
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
      var neighbors = 0;
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
  resizeCanvas(windowWidth, windowHeight - 220);
  select('#header').size(windowWidth, 120).position(0, 0);
  select('#footer').size(windowWidth, 100).position(0, windowHeight - 100);
  loff = (cnvs.width - buff.width) / 2;
  toff = (cnvs.height - buff.height) / 2;
  init();
}

/*sketchers src

// John Conway Game of Life

function setup() {
  
  
  
  //cnvs.center();
  //cnvs.size(250, 250);
  // Create a slider and place it at the top of the canvas.
  slider = createSlider(1, 60, 25, 1);
  slider.position(10, 10);
  slider.size(220);
  
  
  // create Graphics
  buff = createGraphics(288, 288);
  //buff.center();
  
}
function draw() {  
  // Set the framerate using the radio button.
  let rv = slider.value();
  frameRate(rv);  
  
  
}

*/
