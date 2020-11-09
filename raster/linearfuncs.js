import { linearMapCoefficients } from '../math';

export function levels(inBlack, outBlack, inWhite, outWhite) {
  if (inBlack === inWhite) {
    // avoid the div/0 condition by changing the in
    // parameters just enough that they map every value
    // between 0 and 1 to either outBlack or outWhite
    if (outBlack <= outWhite) {
      inBlack -= 1 / 130050;
      inWhite += 1 / 130050;
    } else {
      inBlack += 1 / 130050;
      inWhite -= 1 / 130050;
    }
  }

  return linearMapCoefficients(inBlack, outBlack, inWhite, outWhite);
}

export function contrast(factor) {
  return [factor, 0.5 - 0.5 * factor];
}
