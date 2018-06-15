function setup() {
  var cnt = createDiv('');
  var cnvs = createCanvas(640, 480);
  cnt.size(windowWidth, windowHeight);
  cnt.parent(body);
  cnvs.parent(cnt);
  cnvs.center();
}

function draw() {
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);
}
function windowResized() {
  cnt.size(windowWidth, windowHeight);
}
