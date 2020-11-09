import { det3x3 } from './det3x3';

export function det4x4(
  m11,
  m12,
  m13,
  m14,
  m21,
  m22,
  m23,
  m24,
  m31,
  m32,
  m33,
  m34,
  m41,
  m42,
  m43,
  m44
) {
  if (m41 === 0 && m42 === 0 && m43 === 0 && m44 === 1) {
    return det3x3(m11, m12, m13, m21, m22, m23, m31, m32, m33);
  }

  return (
    -det3x3(m12, m13, m14, m22, m23, m24, m32, m33, m34) * m41 +
    det3x3(m11, m13, m14, m21, m23, m24, m31, m33, m34) * m42 -
    det3x3(m11, m12, m14, m21, m22, m24, m31, m32, m34) * m43 +
    det3x3(m11, m12, m13, m21, m22, m23, m31, m32, m33) * m44
  );
}
