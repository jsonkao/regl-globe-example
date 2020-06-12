#define PI 3.1415926538

precision mediump float;

uniform sampler2D landTexture;
uniform sampler2D monoTexture;

uniform float longitude_offset;

vec3 light_reversed = vec3(-0.5, 0.5, 0.3);
float light_mag = length(light_reversed);

varying vec2 v_position;

void main() {

  // The screen is the tangent plane. Each (x, y) we treat as an
  // orthographically projected point of the front-facing hemisphere.
  // The textures are equirectangular projections, which means the position of
  // an image pixel is just the longitude-latitude.
  // For each fragment, then, we must figure out the corresponding lat-long to
  // retrieve the correct image pixel.

  // 1. Define the projected coordinates.
  //    Discard fragments outside the great circle.

  float x = v_position.x;
  float y = v_position.y;
  float c = x * x + y * y; // Distance from center of orthographic projection

  if (sqrt(c) > 1.) {
    discard;
  }

  // 2. Invert projection to get spherical coordinates

  float depth = sqrt(1. - c); // Purposefully ignoring negative face
  float longitude = atan(x / depth) + longitude_offset; // [-PI / 2, PI / 2]
  float latitude = asin(y);                             // [-PI / 2, PI / 2]

  // 3. Do equirectangular projection to get plane/texture coordinates
  //    For longitude: Map to [0.25, 0.75] (center is 0.5, range is 0.5)
  //    For latitude: Map to [0, 1] (center is 0.5, range is 0.5)

  float texture_x = (longitude + PI) / (2. * PI);
  float texture_y = (latitude + PI / 2.) / PI;

  // 4. Grab texture colors. Black = land, white = no land.

  vec2 texture_position = vec2(mod(texture_x, 1.0), texture_y);
  vec3 texture_color = texture2D(landTexture, texture_position).rgb;
  vec3 mono_color = texture2D(monoTexture, texture_position).rgb;

  texture_color += mono_color;

  // 5. Calculate lighting.

  float dotted = dot(vec3(x, y, depth), light_reversed) / light_mag;
  float light = sign(dotted) * pow(abs(dotted), 1.7);
  light = 0.6 + light * 0.37;

  // gl_FragColor = vec4(texture_color, 1.);
  gl_FragColor = vec4(texture_color, 1.);
  gl_FragColor.rgb *= light;
}
