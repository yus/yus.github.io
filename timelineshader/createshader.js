
// the vertex shader is called for each vertex
let vs = "su.vert";
// the fragment shader is called for each pixel
let fs = "su.frag";
let mandel;
function setup() {
  createCanvas(100, 100, WEBGL);

  // create and initialize the shader
  mandel = createShader(vs, fs);
  shader(mandel);
  noStroke();

  // 'p' is the center point of the Mandelbrot image
  mandel.setUniform('p', [-0.74364388703, 0.13182590421]);
  describe('zooming Mandelbrot set. a colorful, infinitely detailed fractal.');
}

function draw() {
  // 'r' is the size of the image in Mandelbrot-space
  mandel.setUniform('r', 1.5 * exp(-6.5 * (1 + sin(millis() / 2000))));
  plane(width, height);
}
