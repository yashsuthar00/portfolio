// jest.polyfills.js
/**
 * @note The block below contains polyfills for Node.js globals
 * required for Jest to function when running JSDOM tests.
 */

const { TextDecoder, TextEncoder } = require('node:util');

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
});

// Simple fetch polyfill for tests
if (!globalThis.fetch) {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    })
  );
}
