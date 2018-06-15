function setup() {
  var cnt = createDiv('').size(windowWidth, windowHeight);
  var cnvs = createCanvas(windowWidth, windowHeight);
  cnvs.parent(cnt);
  //cnvs.center();
  //cnt.center('horizontal');
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
  resizeCanvas(windowWidth, windowHeight);
}
