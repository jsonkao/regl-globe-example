precision mediump float;

varying float v_depth;

void main() {
  // Discard when depth is negative, whether interpolated or not.
  if (v_depth < 0.) {
    discard;
  }

  gl_FragColor = vec4(vec3(230. / 255.), 1.);
}
