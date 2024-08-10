let layer;
function setup() {
  createCanvas(288, 288, WEBGL);
  layer = createFramebuffer();
  describe('a rotating red cube with yellow dots on each face');
}
function draw() {
  let t = millis() * 0.001;
  layer.begin();
  background('lilac');
  noStroke();
  fill('tan');
  for (let i = 0; i < 30; i += 1) {
    circle(
      map(noise(i*10, 0, t), 0, 1, -width/2, width/2),
      map(noise(i*10, 100, t), 0, 1, -height/2, height/2),
      20
    );
  }
  layer.end();
 
  background(52);
  lights();
  noStroke();
  texture(layer);
  rotateX(t/TAU);
  rotateY(t/TAU);
  box(100);
}
