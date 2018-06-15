function setup() {
  var b = select(body);
  b.style('margin', 0);
  var cnt = createDiv('');
  cnt.parent(b);
  cnt.size(windowWidth-100, windowHeight-100);
  cnt.center();
  var cnvs = createCanvas(640, 480);
  cnvs.parent(cnt);
  cnvs.center();
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
}
