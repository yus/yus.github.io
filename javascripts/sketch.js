function setup() {
  var cnt = createDiv('').size(windowWidth-100, windowHeight-100);
  var cnvs = createCanvas(cnt.size());
  cnvs.parent(cnt);
  cnvs.center();
  cnt.center('horizontal');
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
  cnt.size(windowWidth-100, windowHeight-100);
  resizeCanvas(cnt.size());
}
