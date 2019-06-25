"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_decoder_1 = require("string_decoder");
const stream_1 = require("stream");
class StringWritable extends stream_1.Writable {
    constructor(options) {
        super(options);
        this._decoder = new string_decoder_1.StringDecoder(options && options.defaultEncoding);
        this._data = '';
    }
    get data() {
        return this._data;
    }
    _write(chunk, encoding, callback) {
        if (encoding === 'buffer') {
            chunk = this._decoder.write(chunk);
        }
        this._data += chunk;
        callback();
    }
    _final(callback) {
        this._data += this._decoder.end();
        callback();
    }
}
exports.StringWritable = StringWritable;
