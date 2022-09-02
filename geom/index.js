/**
 * @file geom: Geometry utilities
 *
 * Contains fixed-size linear algebra classes useful for 2D and 3D geometry,
 * plus some utilities for 2D rectangles and 2D line intersections. Tries to
 * strike a balance between performance and readability of calling code.
 *
 * I could've sworn I had unit tests for these somewhere.
 */

import * as geomcanvas from './geomcanvas';
import * as intersect from './intersect';
import * as mat2 from './mat2';
import * as mat3 from './mat3';
import * as mat4 from './mat4';
import * as mata5 from './mata5';
import * as quaternion from './quaternion';
import * as rectangle from './rectangle';
import * as vec2 from './vec2';
import * as vec3 from './vec3';
import * as vec4 from './vec4';

export {
  geomcanvas,
  intersect,
  mat2,
  mat3,
  mat4,
  mata5,
  quaternion,
  rectangle,
  vec2,
  vec3,
  vec4,
};
