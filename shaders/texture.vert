precision mediump float;

uniform vec2 aspectRatio;

attribute vec2 position;

varying vec2 v_position;

void main() {
  // For some reason textures only cover the first quadrant of the clip space.
  // Remember that v_position should become the coordinate of the texture in
  // clip space. Cutting position in half means that (1, 1) in the clip space
  // becomes (0.5, 0.5) on the texture.
  // two quadrants' worth of space.
  // Adding 0.5 to position means that (1, 1) in the clip space becomes (1, 1)
  // on the texture, and similarly (0, 0) -> (0.5, 0.5) (the texture's center)
  // and (-1, -1) -> (0, 0).

  // v_position = 0.5 + position * 0.5;
  v_position = position * aspectRatio;

  // gl_Position should be position because the position attribute covers the
  // whole clip space
  gl_Position = vec4(position, 0, 1);
}
