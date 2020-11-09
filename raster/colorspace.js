// stored as just red and blue. green is calculated as 1 - red - blue to
// minimize float error
const LUMA_WEIGHTS = {
  average: [1 / 3, 1 / 3],
  srgb: [0.2126, 0.0722],
  w3c_compositing: [0.3, 0.11],
};

export function getLumaWeights(name) {
  const rb = LUMA_WEIGHTS[name];
  if (!rb) {
    return null;
  }
  return [rb[0], 1 - rb[0] - rb[1], rb[1]];
}
