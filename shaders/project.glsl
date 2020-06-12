precision mediump float;

#define PI 3.1415926538

vec3 project(vec2 point, float longitude_offset) {
  point *= PI / 180.;
  float lon = point[0];
  float lat = point[1];

  float azimuth = lon - longitude_offset;
  float inclination = PI / 2. - lat;

  float depth = sin(inclination) * cos(azimuth);
  float x = sin(inclination) * sin(azimuth);
  float y = cos(inclination);

  return vec3(x, y, depth);
}

#pragma glslify: export(project)
