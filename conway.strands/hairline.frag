precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D texture;

void main() {
    vec4 color = texture2D(texture, vTexCoord);
    gl_FragColor = color;
}
