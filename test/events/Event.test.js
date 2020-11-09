import { assert } from 'chai';

import { Event } from '../../events';

describe('events#Event', () => {
  describe('#constructor()', () => {
    it('Accepts a single string argument', () => {
      const event = new Event('test');
      assert.instanceOf(event, Event);
      assert.strictEqual(event.type, 'test');
    });

    it('Accepts a mixin argument', () => {
      const event = new Event({
        type: 'test',
        testProperty: 1,
      });
      assert.instanceOf(event, Event);
      assert.strictEqual(event.type, 'test');
      assert.strictEqual(event.testProperty, 1);
    });

    it('Accepts a string and mixin argument', () => {
      const event = new Event('test', {
        testProperty: 1,
        anotherTestProperty: 2,
      });
      assert.instanceOf(event, Event);
      assert.strictEqual(event.type, 'test');
      assert.strictEqual(event.testProperty, 1);
      assert.strictEqual(event.anotherTestProperty, 2);
    });
  });

  describe('#preventDefault()', () => {
    it("flags that the event's default action is prevented", () => {
      const event = new Event('test');
      assert.isFalse(event.isDefaultPrevented());
      event.preventDefault();
      assert.isTrue(event.isDefaultPrevented());
    });

    it('is idempotent', () => {
      const event = new Event('test');
      event.preventDefault();
      assert.isTrue(event.isDefaultPrevented());
      event.preventDefault();
      assert.isTrue(event.isDefaultPrevented());
    });
  });
});
