uniform float utime;
uniform float noiseEffect;
uniform float patternShape;
uniform float noisespeed;
uniform float patternAngle;
uniform float lighting;

varying vec2 vUv;
varying vec3 vposition; 

// noise 
float mod289(float x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 perm(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

float noise(vec3 p) {
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}
// stripes function 
float lines(vec2 uv, float offset, float ushift) {
    return smoothstep(0.0, 0.6 + offset * 0.6, 0.5 * (sin((uv.x * ushift * 2.0)) + offset * 2.0));
}

mat2 roatate2D(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), -sin(angle));
}
void main() {

// colors
    vec3 blue = vec3(0.23, 0.28, 1);
    vec3 cyan = vec3(0.32, 0.78, 1);
    vec3 yellow = vec3(1.0, 1.0, 0.0);
    vec3 red = vec3(1, 0, 0);
    vec3 orange = vec3(1, 0.63, 0.24);
    vec3 white = vec3(1, 0.93, 0.71);
    vec3 dark = vec3(0.0, 0.0, 0.0);

    float n = noise(vposition + utime * noisespeed); // noise 

    vec2 baseUv = roatate2D((n * noiseEffect) - patternAngle) * (vposition.xy) * patternShape; // rotation function 
    // vec2 baseUv = vposition.xy;
// patterns 
    float basepattern = lines(baseUv, 0.6, 1.3);
    float secondpattern = lines(baseUv, 0.2, 2.6);
    float thirdpattern = lines(baseUv, 0.3, 1.6);
    float forthpattern = lines(baseUv, 0.1, 1.3);
    float fifthpattern = lines(baseUv, 1.1, 0.8);
// colors by pattern 
    vec3 basecolor = mix(orange, red * 2.0, basepattern);
    vec3 secondcolor = mix(basecolor, white, secondpattern);
    vec3 thirdcolor = mix(secondcolor, cyan, thirdpattern);
    vec3 forthcolor = mix(thirdcolor, blue, forthpattern);
    vec3 fifthcolor = mix(forthcolor, dark, fifthpattern);

    gl_FragColor = vec4(vec3(fifthcolor) * (lighting), 1.0);
}
