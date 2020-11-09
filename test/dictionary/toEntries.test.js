import { assert } from 'chai';

import { toEntries } from '../../dictionary';

function sortEntryArrayByPropertyName(array) {
  array.sort((a, b) => {
    if (a[0] < b[0]) {
      return -1;
    }
    if (a[0] > b[0]) {
      return 1;
    }
    return 0;
  });
  return array;
}

describe('dictionary#toEntries', () => {
  it("creates array of an object's own entries", () => {
    const object = Object.assign(Object.create({ p: 'PP' }), {
      a: 'AA',
      b: 'BB',
    });
    const expectSorted = [
      ['a', 'AA'],
      ['b', 'BB'],
    ];

    const gotSorted = sortEntryArrayByPropertyName(toEntries(object));

    assert.deepEqual(gotSorted, expectSorted);
  });

  it('creates an empty array from an empty object', () => {
    assert.deepEqual(toEntries({}), []);
  });
});
