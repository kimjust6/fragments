const Fragment = require('../../src/model/fragment');

describe('Testing Fragments', () => {
  //
  test('testing isSupportedType', () => {
    expect(Fragment.isSupportedType('text').toBe(true));
    expect(Fragment.isSupportedType('text/plain').toBe(true));
    expect(Fragment.isSupportedType('image/gif').toBe(true));
    expect(Fragment.isSupportedType('image/x-icon').toBe(false));
  });

  test('testing isSupportedType', () => {
    expect(Fragment.isSupportedType('text').toBe(true));
    expect(Fragment.isSupportedType('text/plain').toBe(true));
    expect(Fragment.isSupportedType('image/gif').toBe(true));
  });
});
