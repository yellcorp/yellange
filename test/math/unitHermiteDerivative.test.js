import { assert } from 'chai';

import { unitHermiteDerivative } from '../../math';

describe('math#unitHermiteDerivative()', () => {
  it('can correctly describe d/dx y=x', () => {
    assert.strictEqual(unitHermiteDerivative(0, 1, 1, 1, 0), 1);
    assert.strictEqual(unitHermiteDerivative(0, 1, 1, 1, 0.25), 1);
    assert.strictEqual(unitHermiteDerivative(0, 1, 1, 1, 0.5), 1);
    assert.strictEqual(unitHermiteDerivative(0, 1, 1, 1, 0.75), 1);
    assert.strictEqual(unitHermiteDerivative(0, 1, 1, 1, 1), 1);
  });

  it('can correctly describe d/dt smoothStep', () => {
    assert.strictEqual(unitHermiteDerivative(0, 0, 1, 0, 0), 0);
    assert.strictEqual(unitHermiteDerivative(0, 0, 1, 0, 0.25), 1.125);
    assert.strictEqual(unitHermiteDerivative(0, 0, 1, 0, 0.5), 1.5);
    assert.strictEqual(unitHermiteDerivative(0, 0, 1, 0, 0.75), 1.125);
    assert.strictEqual(unitHermiteDerivative(0, 0, 1, 0, 1), 0);
  });

  it('is correct for d/dt p=0, m=-1, q=1, n=-1', () => {
    assert.strictEqual(unitHermiteDerivative(0, -1, 1, -1, 0), -1);
    assert.strictEqual(unitHermiteDerivative(0, -1, 1, -1, 0.25), 1.25);
    assert.strictEqual(unitHermiteDerivative(0, -1, 1, -1, 0.5), 2);
    assert.strictEqual(unitHermiteDerivative(0, -1, 1, -1, 0.75), 1.25);
    assert.strictEqual(unitHermiteDerivative(0, -1, 1, -1, 1), -1);
  });

  it('is correct for d/dt p=1, m=0, q=-2, n=4', () => {
    assert.strictEqual(unitHermiteDerivative(1, 0, -2, 4, 0), 0);
    assert.strictEqual(unitHermiteDerivative(1, 0, -2, 4, 0.25), -4.625);
    assert.strictEqual(unitHermiteDerivative(1, 0, -2, 4, 0.5), -5.5);
    assert.strictEqual(unitHermiteDerivative(1, 0, -2, 4, 0.75), -2.625);
    assert.strictEqual(unitHermiteDerivative(1, 0, -2, 4, 1), 4);
  });
});
