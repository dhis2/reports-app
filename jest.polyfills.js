// jest.polyfills.js
const { TextEncoder, TextDecoder } = require('util')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

try {
    const { ReadableStream } = require('web-streams-polyfill/ponyfill/es6')
    global.ReadableStream = ReadableStream
    console.log('[jest.polyfills.js] ✅ Polyfills loaded')
} catch (e) {
    console.warn('[jest.polyfills.js] ⚠️ Failed to load ReadableStream')
}
