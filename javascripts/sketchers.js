// John Conway Game of Life

var clrtable, clr, folor, cnt, cnvs, tinges;
var buff, loff, toff, w, columns, rows, board, next;

function preload() {
  clrtable = loadTable('javascripts/colors.csv', 'csv', 'header');
}

function setup() {
  clrtable.removeColumn(0);
  console.log(clrtable.getColumnCount());
  tinges = [];
  for (var r = 0; r < clrtable.getRowCount(); r++) {
    for (var c = 0; c < clrtable.getColumnCount(); c++) {
      tinges.push(clrtable.getString(r, c));
    }
  }

  select('body').attribute('style', 'margin:0; overflow:hidden');
  cnt = createDiv('').size(windowWidth, windowHeight);
  cnt.style('background', '#222');
  
  cnvs = createCanvas(windowWidth, windowHeight-220);
  cnvs.parent(cnt).position(0,120).background(52);
  //cnvs.size(555, 555);
  let hdr = createDiv('').id('header').parent(cnt);
  select('#header').size(windowWidth,120).position(0,0);
  
  let ftr = createDiv('').id('footer').parent(cnt);
  select('#footer').size(windowWidth,100).position(0,windowHeight-100);
  let logo = createImg('images/yus143.png'); 
  logo.parent('#header').position(72,29);

  let rlgh = createA('https://github.com/',
                      '<img src="images/ghmarkw.png" alt="github" height="29">');
  rlgh.parent('#footer').position(72,29);

  let rl5 = createA('https://processing.org',
                      '<img src="images/processing.png" alt="processing" height="19">');
  rl5.parent('#footer').position(129,45);

// create Graphics
  
  buff = createGraphics(250, 250);
  //buff.center();
  
  w = 25;
  columns = floor(buff.width/w); //cnvs
  rows = floor(buff.height/w);
  board = new Array(columns);
  for (var i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  } 
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  
  loff = (cnvs.width - buff.width)/2;
  toff = (cnvs.height - buff.height)/2;
  
  init();
}

function draw() {
  generate();
  for ( var i = 0; i < columns;i++) {
    for ( var j = 0; j < rows;j++) {
      if ((board[i][j] == 1))
        buff.fill(clr);
      else 
        buff.fill(folor); 
        buff.stroke(52);
        buff.rect(i*w, j*w, w-1, w-1);
        image(buff, loff, toff);
    }
  }
}

function mousePressed() {
  init();
}

function init() {
  colors();
  for (var i = 0; i < columns; i++) {
    for (var j = 0; j < rows; j++) {
      // Lining the edges with 0s
      if (i == 0 || j == 0 || i == columns-1 || j == rows-1) 
        board[i][j] = 0;
      // Filling the rest randomly
      else 
        board[i][j] = floor(random(2));
        next[i][j] = 0;
    }
  }
}

function generate() {
  for (var x = 1; x < columns - 1; x++) {
    for (var y = 1; y < rows - 1; y++) {
      var neighbors = 0;
      for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
          neighbors += board[x+i][y+j];
        }
      }

      neighbors -= board[x][y];
      if      ((board[x][y] == 1) && (neighbors <  2)) 
        next[x][y] = 0; // Loneliness
      else if ((board[x][y] == 1) && (neighbors >  3)) 
        next[x][y] = 0; // Overpopulation
      else if ((board[x][y] == 0) && (neighbors == 3)) 
        next[x][y] = 1; // Reproduction
      else 
        next[x][y] = board[x][y]; // Stasis
    }
  }
  // Swap!
  var temp = board;
  board = next;
  next = temp;
}

function colors() {
  shuffle(tinges);
  var q = floor(random(tinges.length));
  var qf = floor(random(tinges.length));
  clr = tinges[q];
  folor = tinges[qf];
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

function windowResized() {
  cnt.size(windowWidth, windowHeight);
  resizeCanvas(windowWidth, windowHeight-220);
  select('#header').size(windowWidth,120).position(0,0);
select('#footer').size(windowWidth,100).position(0,windowHeight-100);
  loff = (cnvs.width - buff.width)/2;
  toff = (cnvs.height - buff.height)/2;
  init();
}
