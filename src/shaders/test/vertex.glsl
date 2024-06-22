uniform float utime;

varying vec2 vUv;
varying vec3 vposition;

void main() {

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
    vposition = position;
}