import { assert } from 'chai';

import { escape } from '../../regex';

describe('regex#escape()', () => {
  it('escapes metacharacters only', () => {
    assert.strictEqual(
      escape('^$(|)[]{}.?*+\\ dD\nwW\u30c6sStrnvf'),
      '\\^\\$\\(\\|\\)\\[\\]\\{\\}\\.\\?\\*\\+\\\\ dD\nwW\u30c6sStrnvf'
    );
  });
});
