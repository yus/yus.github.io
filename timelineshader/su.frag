precision highp float;
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
}
