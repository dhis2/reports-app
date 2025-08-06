const { Blob, File } = require('node:buffer')
const { ReadableStream } = require('node:stream/web')
const { TextDecoder, TextEncoder } = require('node:util')

global.TextDecoder = global.TextDecoder || TextDecoder
global.TextEncoder = global.TextEncoder || TextEncoder
global.ReadableStream = global.ReadableStream || ReadableStream
global.Blob = global.Blob || Blob
global.File = global.File || File

/* eslint-disable no-empty */
jest.mock('undici', () => ({
    fetch: () =>
        Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({}),
            text: async () => '',
        }),
    Request: class {},
    Response: class {},
    Headers: class {},
}))
/* eslint-disable no-empty */
