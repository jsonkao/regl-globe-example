import createREGL from 'regl';
import { compute_borders } from './vertices';

import bordersFrag from './shaders/borders.frag';
import bordersVert from './shaders/borders.vert';
import textureFrag from './shaders/texture.frag';
import textureVert from './shaders/texture.vert';

import specImg from './specularity@2x.png';
import monoImg from './mono@2x.png';

import borderData from './borders.dat';

const regl = createREGL();

async function getBorders() {
  return fetch(`./${borderData}`)
    .then(response => response.arrayBuffer())
    .then(buffer => compute_borders(buffer));
}

async function getTexture(filename) {
  return new Promise(resolve => {
    const image = new Image();
    image.src = filename; // `${base}/textures/${filename}`;
    image.crossOrigin = '';
    image.onload = () => resolve(regl.texture({ data: image, flipY: true }));
  });
}

const longitude_offset = regl.prop('longitude_offset');

function createLineDrawer(vertices) {
  return regl({
    frag: bordersFrag,
    vert: bordersVert,

    uniforms: {
      aspectRatio,
      longitude_offset,
    },

    blend: {
      enable: true,
      func: {
        src: 'src alpha',
        dst: 'one minus src alpha',
      },
    },
    depth: { enable: false },
    attributes: { position: vertices },

    count: vertices.length / 2,
    primitive: 'lines',
  });
}

async function main() {
  const [
    borders,
    landTexture,
    monoTexture,
  ] = await Promise.all([
    getBorders(),
    getTexture(specImg),
    getTexture(monoImg),
  ]);

  const drawBorders = createLineDrawer(borders);

  const drawTexture = regl({
    frag: textureFrag,
    vert: textureVert,

    uniforms: {
      landTexture,
      monoTexture,
      aspectRatio,
      longitude_offset,
    },

    attributes: {
      // Two triangles that cover the whole clip space
      position: regl.buffer([
        [-1, 1],
        [1, -1],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ]),
    },

    count: 6,
  });

  regl.frame(({ time }) => {
    const longitude_offset = time / 10;

    drawTexture({ longitude_offset });
    drawBorders({ longitude_offset });
  });
}

main().catch(console.error);

function aspectRatio({ viewportWidth, viewportHeight }) {
  const ar = viewportWidth / viewportHeight;
  return ar > 1 ? [ar, 1] : [1, 1 / ar];
}
