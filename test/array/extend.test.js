import { assert } from 'chai';

import { extend } from '../../array';

describe('array#extend()', () => {
  it('extends an array', () => {
    const subject = [0, 1, 2];

    const retVal = extend(subject, [3, 4, 5]);
    assert.strictEqual(retVal, subject);
    assert.deepEqual(subject, [0, 1, 2, 3, 4, 5]);
  });

  it('accepts multiple extension arrays', () => {
    const subject = [0, 1, 2];
    extend(subject, [3, 4, 5], [6, 7, 8]);
    assert.deepEqual(subject, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('accepts no extension arrays', () => {
    const subject = [0, 1, 2];
    extend(subject);
    assert.deepEqual(subject, [0, 1, 2]);
  });

  it('accepts empty extension arrays', () => {
    const subject = [0, 1, 2];
    extend(subject, [], [3, 4, 5]);
    assert.deepEqual(subject, [0, 1, 2, 3, 4, 5]);
  });

  it('works with large arrays', () => {
    const subject = [];
    const ext1 = [];
    const ext2 = [];
    const expect = [];

    for (let i = 0; i < 0x80000; i++) {
      expect[i] = i;
      if (i < 0x20000) {
        subject[i] = i;
      } else if (i < 0x40000) {
        ext1[i - 0x20000] = i;
      } else {
        ext2[i - 0x40000] = i;
      }
    }

    extend(subject, ext1, ext2);
    assert.deepEqual(subject, expect);
  });
});
