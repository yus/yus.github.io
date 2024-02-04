// the vertex shader is called for each vertex
let vs = `precision highp float;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
 }`;

// the fragment shader is called for each pixel
let fs = `precision highp float;
uniform vec2 p;
uniform float r;
const int I = 500;
varying vec2 vTexCoord;
   
void main() {
  vec2 c = p + gl_FragCoord.xy * r, z = c;
  float n = 0.0;
  for (int i = I; i > 0; i --) {
    if(z.x*z.x+z.y*z.y > 4.0) {
      n = float(i)/float(I);
      break;
    }
    z = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y) + c;
  }
  gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);
}`;

let mandel;

function setup() {
  createCanvas(300, 300, WEBGL);

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
