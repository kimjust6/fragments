const Fragment = require('../../src/model/fragment');
const { randomUUID } = require('crypto');

describe('Testing Fragments', () => {
  let frag;
  // Each test will get its own, new fragment
  beforeEach(() => {
    frag = new Fragment({
      id: randomUUID(),
      ownerId: 1,
      created: '2022/09/10',
      updated: '2022/09/10',
      type: 'text',
    });
  });

  test('testing isSupportedType', () => {
    expect(frag.isSupportedType('text').toBe(true));
    expect(frag.isSupportedType('text/plain').toBe(true));
    expect(frag.isSupportedType('image/gif').toBe(true));
    expect(frag.isSupportedType('image/x-icon').toBe(false));
  });
});
