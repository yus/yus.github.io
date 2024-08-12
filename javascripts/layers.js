// John Conway Game of Life
let clrtable, clr, folor, cnt, cnvs, tinges, button;
let buff, loff, toff, w, columns, rows, board, next;
let fruit, slider, camp, defcamp;
let isDefaultCamp = true;

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

  // Create a button and set its value to 0.
  // Place the button beneath the canvas.
  button = createButton('CHANGE CAMP');
  button.position(150, 150);

  // Call changeCamp() when the button is pressed.
  button.mousePressed(changeCamp);
  
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

  buff.begin();
  camp = createCamera();
  camp.setPosition(random(400), -random(400), 800);
  camp.lookAt(0, 0, 0);
  defcamp = createCamera();
  defcamp.setPosition(0, 0, 800);
  defcamp.lookAt(0, 0, 0);
    
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
  loff = buff.width; // (cnvs.width -)/2;
  toff = buff.height; // (cnvs.height -)/2;

  init();
  buff.end();
}

function draw() {
  let t = millis() * 0.001;
  // Start drawing to the framebuffer
  buff.begin();

  clear();
  lights();
  background(52);

  // Reset all transformations.
  resetMatrix();
  
  generate();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if ((board[i][j] == 1))
      fill(clr);
       else
      fill(folor);
      stroke(52);
      square(i * w, j * w, w - 1);
      image(buff, 0, 0);
    }
  }

  buff.end();
  // Draw the layer to the main canvas
  clear();
  
  //translate(-width/2, -height/2);
  //rotateX(t/TAU);
  //rotateY(t/TAU);
  // Enable orbiting with the mouse.
  orbitControl();
  // Style the box.
  normalMaterial();
  texture(buff);
  textureMode(NORMAL);
  box(220);
}
function mouseClicked() {
  init();
}
function changeCamp() {
  if (isDefaultCamp === true) {
    setCamera(camp);
    isDefaultCamp = false;
  } else {
    setCamera(defcamp);
    isDefaultCamp = true;
  }
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
/**/
