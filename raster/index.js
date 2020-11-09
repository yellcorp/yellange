/**
 * raster: Image manipulation through pixel arrays.
 *
 * The code in this module traces its lineage to before the wide availability
 * of WebGL, but may still be useful if you have just a `<canvas>` and little
 * desire to pull in a whole GL library.
 */

import * as blendfuncs from './blendfuncs';
import * as colormatrix from './colormatrix';
import * as colorspace from './colorspace';
import { findAlphaExtents } from './extents';
import * as histogram from './histogram';
import * as linearfuncs from './linearfuncs';
import * as visualize from './visualize';

export {
  blendfuncs,
  colormatrix,
  colorspace,
  findAlphaExtents,
  histogram,
  linearfuncs,
  visualize,
};
