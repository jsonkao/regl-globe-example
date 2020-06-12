export function compute_borders(buffer) {
  // First uint32 (4 bytes) contain the number of line strings.
  const count = new Uint32Array(buffer, 0, 1)[0];
  // Each of the next `count` uint32s stores the vertex count of a line string.
  const indices = new Uint32Array(buffer, 4, count);
  // Rest of bytes contain vertex coordinates (alternating long-lat pairs)
  const coords = new Float32Array(buffer, 4 * (indices.length + 1));

  const vertices = [];
  let v = 0;

  for (let i = 0; i < indices.length; i += 1) {
    const len = indices[i];

    let a = [coords[v++], coords[v++]];

    for (let j = 1; j < len; j += 1) {
      const b = [coords[v++], coords[v++]];

      vertices.push(...a, ...b);

      a = b;
    }
  }

  return new Float32Array(vertices);
}
