const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = global.TextEncoder || TextEncoder
global.TextDecoder = global.TextDecoder || TextDecoder

try {
    const { ReadableStream } = require('web-streams-polyfill/ponyfill/es6')
    global.ReadableStream = global.ReadableStream || ReadableStream
    console.log('[jest.polyfills.js] ✅ Polyfills loaded')
} catch (e) {
    console.warn(
        '[jest.polyfills.js] ⚠️ Failed to load ReadableStream:',
        e.message
    )
}
