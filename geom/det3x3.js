export function det3x3(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
  return (
    m11 * m22 * m33 +
    m12 * m23 * m31 +
    m13 * m21 * m32 -
    m13 * m22 * m31 -
    m12 * m21 * m33 -
    m11 * m23 * m32
  );
}
