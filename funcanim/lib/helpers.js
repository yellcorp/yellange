export function linearCoefficientsPoints(x0, y0, x1, y1, out) {
  out[0] = (y1 - y0) / (x1 - x0);
  out[1] = out[0] * -x0 + y0;
}

export function linearCoefficientsPointDelta(x0, y0, dy, out) {
  out[0] = dy;
  out[1] = dy * -x0 + y0;
}
