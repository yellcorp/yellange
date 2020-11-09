import { assert } from 'chai';

import { unitHermite } from '../../math';

describe('math#unitHermite()', () => {
  it('can correctly describe x=y', () => {
    assert.strictEqual(unitHermite(0, 1, 1, 1, 0), 0);
    assert.strictEqual(unitHermite(0, 1, 1, 1, 0.25), 0.25);
    assert.strictEqual(unitHermite(0, 1, 1, 1, 0.5), 0.5);
    assert.strictEqual(unitHermite(0, 1, 1, 1, 0.75), 0.75);
    assert.strictEqual(unitHermite(0, 1, 1, 1, 1), 1);
  });

  it('can correctly describe smoothStep', () => {
    assert.strictEqual(unitHermite(0, 0, 1, 0, 0), 0);
    assert.strictEqual(unitHermite(0, 0, 1, 0, 0.25), 0.15625);
    assert.strictEqual(unitHermite(0, 0, 1, 0, 0.5), 0.5);
    assert.strictEqual(unitHermite(0, 0, 1, 0, 0.75), 0.84375);
    assert.strictEqual(unitHermite(0, 0, 1, 0, 1), 1);
  });

  it('is correct for p=0, m=-1, q=1, n=-1', () => {
    assert.strictEqual(unitHermite(0, -1, 1, -1, 0), 0);
    assert.strictEqual(unitHermite(0, -1, 1, -1, 0.25), 0.0625);
    assert.strictEqual(unitHermite(0, -1, 1, -1, 0.5), 0.5);
    assert.strictEqual(unitHermite(0, -1, 1, -1, 0.75), 0.9375);
    assert.strictEqual(unitHermite(0, -1, 1, -1, 1), 1);
  });

  it('is correct for p=1, m=0, q=-2, n=4', () => {
    assert.strictEqual(unitHermite(1, 0, -2, 4, 0), 1);
    assert.strictEqual(unitHermite(1, 0, -2, 4, 0.25), 0.34375);
    assert.strictEqual(unitHermite(1, 0, -2, 4, 0.5), -1);
    assert.strictEqual(unitHermite(1, 0, -2, 4, 0.75), -2.09375);
    assert.strictEqual(unitHermite(1, 0, -2, 4, 1), -2);
  });
});
