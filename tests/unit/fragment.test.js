const Fragment = require('../../src/model/fragment');

describe('Testing Fragments', () => {
  let frag;
  // Each test will get its own, new fragment
  frag = new Fragment();

  test('testing isSupportedType', () => {
    expect(frag.isSupportedType('text').toBe(true));
    expect(frag.isSupportedType('text/plain').toBe(true));
    expect(frag.isSupportedType('image/gif').toBe(true));
    expect(frag.isSupportedType('image/x-icon').toBe(false));
  });
});
