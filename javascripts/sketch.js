function setup() {
  select('body').attribute('style', 'margin:0; overflow:hidden');
  var cnt = createDiv('').size(windowWidth, windowHeight);
  cnt.style('background', '#222');
  var cnvs = createCanvas(windowWidth, windowHeight-220);
  cnvs.parent(cnt).position(0,120).background(52);
  var hdr = createDiv('').id('header').parent(cnt);
  select('#header').size(windowWidth,120).position(0,120);
  var ftr = createDiv('').id('footer').parent(cnt);
  select('#footer').size(windowWidth,100).position(0,windowHeight-100);
}

function draw() {
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 25, 25);
}
function windowResized() {
  cnt.size(windowWidth, windowHeight);
  resizeCanvas(windowWidth, windowHeight-220);
  select('#header').size(windowWidth,120).position(0,120);
  select('#footer').size(windowWidth,100).position(0,windowHeight-100);
}
