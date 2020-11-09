import { assert } from 'chai';

import { parseColor } from '../../css/parsecolor';

describe('css#parseColor', () => {
  it('parses 3-digit hex codes', () => {
    assert.deepEqual(parseColor('#9Ab'), [0x99, 0xaa, 0xbb]);
  });

  it('parses 6-digit hex codes', () => {
    assert.deepEqual(parseColor('#9AbCdE'), [0x9a, 0xbc, 0xde]);
  });

  it('rejects irregular-length hex codes', () => {
    assert.strictEqual(parseColor('#1234'), null);

    assert.strictEqual(parseColor('#1234567'), null);
  });

  it('parses rgb function notation', () => {
    assert.deepEqual(parseColor('rgb(64, 128, 192)'), [64, 128, 192]);

    assert.deepEqual(parseColor('rgb(0%, 50%, 100%)'), [0, 128, 255]);
  });

  it('parses rgba function notation', () => {
    assert.deepEqual(parseColor('rgba(64, 128, 192, 0.5)'), [
      64,
      128,
      192,
      0.5,
    ]);

    assert.deepEqual(parseColor('rgba(0%, 50%, 100%, 0.5)'), [
      0,
      128,
      255,
      0.5,
    ]);
  });

  it('parses hsl function notation', () => {
    assert.deepEqual(parseColor('hsl(300, 50%, 50%)'), [191, 64, 191]);
  });

  it('parses hsla function notation', () => {
    assert.deepEqual(parseColor('hsla(300, 50%, 50%, 0.5)'), [
      191,
      64,
      191,
      0.5,
    ]);
  });

  it('rejects malformed function notation', () => {
    assert.strictEqual(parseColor('rgb(64, 128, 192'), null);
    assert.strictEqual(parseColor('rgb(64, 128)'), null);
    assert.strictEqual(parseColor('rgb(64, 128, 192, 4, 5)'), null);
    assert.strictEqual(parseColor('rgba(64, 128, 192, 0.5'), null);
    assert.strictEqual(parseColor('rgba(64, 128, 192)'), null);
    assert.strictEqual(parseColor('rgba(64, 128, 192, 1, 5)'), null);
  });

  it("parses 'transparent'", () => {
    assert.deepEqual(parseColor('transparent'), [0, 0, 0, 0]);
  });

  it("parses 'lightgoldenrodyellow'", () => {
    assert.deepEqual(parseColor('lightgoldenrodyellow'), [0xfa, 0xfa, 0xd2]);
  });
});
