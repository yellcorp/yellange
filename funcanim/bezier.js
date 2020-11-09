/**
 * @file funcanim/bezier
 *
 * These are (or can be!) polybeziers, where the end of each bezier segment is
 * the start of the following one. linearBezier is just a polyline.
 *
 * Points should be a completely flat array.  Each of a point's dimensions are
 * stored next to each other in the array, and each point follows on from
 * the previous.
 *
 * For example a 3D point is stored as follows:
 * `[ Px, Py, Pz ]`
 *
 * A single segment is stored as N adjacent points, where N is the degree of
 * the curve. The exception is the first segment, which uses N+1 points.
 * For example a complete 3D cubic bezier segment is stored as follows:
 * `[ P0x, P0y, P0z, P1x, P1y, P1z, P2x, P2y, P2z, P3x, P3y, P3z ]`
 * Where `P0` is the start point, `P1` the first influence handle, `P2` the
 * second influence handle, and `P3` the end point.
 *
 * An `evaluate()` parameter of 0 returns the start of the first segment. A
 * parameter of 1 returns the end of the first / beginning of the second. And
 * so on. Numbers between integers interpolate between the terminal points of
 * that segment.
 */

export function linearBezier(dimension, initialPoints) {
  const result = new Array(dimension);
  return {
    type: 'linearBezier',
    dimension,
    degree: 1,
    points: initialPoints,
    evaluate(param) {
      const points = this.points;
      const piece = param < 0 ? 0 : Math.floor(param);

      let t = param - piece;
      let it = 1 - t;

      let p0 = piece * dimension;
      let p1 = p0 + dimension;

      if (p1 >= points.length) {
        p1 = points.length - dimension;
        p0 = p1 - dimension;
        t = 1;
        it = 0;
      }

      for (let d = 0; d < dimension; d++) {
        result[d] = it * points[p0 + d] + t * points[p1 + d];
      }

      return result;
    },
  };
}

export function quadraticBezier(dimension, initialPoints) {
  const result = new Array(dimension);
  return {
    type: 'quadraticBezier',
    dimension,
    degree: 2,
    points: initialPoints,
    evaluate(param) {
      const points = this.points;
      const piece = param < 0 ? 0 : Math.floor(param);

      let t = param - piece;
      let it = 1 - t;

      let p0 = piece * dimension * 2;

      let p1 = p0 + dimension;
      let p2 = p1 + dimension;

      if (p2 >= points.length) {
        p2 = points.length - dimension;
        p1 = p2 - dimension;
        p0 = p1 - dimension;
        t = 1;
        it = 0;
      }

      const c0 = it * it;
      const c1 = 2 * it * t;
      const c2 = t * t;

      for (let d = 0; d < dimension; d++) {
        result[d] =
          c0 * points[p0 + d] + c1 * points[p1 + d] + c2 * points[p2 + d];
      }

      return result;
    },
  };
}

export function cubicBezier(dimension, initialPoints) {
  const result = new Array(dimension);
  return {
    type: 'cubicBezier',
    dimension,
    degree: 3,
    points: initialPoints,
    evaluate(param) {
      const points = this.points;
      const piece = param < 0 ? 0 : Math.floor(param);

      let t = param - piece;
      let it = 1 - t;

      let p0 = piece * dimension * 3;

      let p1 = p0 + dimension;
      let p2 = p1 + dimension;
      let p3 = p2 + dimension;

      if (p3 >= points.length) {
        p3 = points.length - dimension;
        p2 = p3 - dimension;
        p1 = p2 - dimension;
        p0 = p1 - dimension;
        t = 1;
        it = 0;
      }

      const c0 = it * it * it;
      const c1 = 3 * it * it * t;
      const c2 = 3 * it * t * t;
      const c3 = t * t * t;

      for (let d = 0; d < dimension; d++) {
        result[d] =
          c0 * points[p0 + d] +
          c1 * points[p1 + d] +
          c2 * points[p2 + d] +
          c3 * points[p3 + d];
      }

      return result;
    },
  };
}
