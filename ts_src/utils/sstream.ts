import { NodeStringDecoder, StringDecoder } from "string_decoder";
import { Writable, Duplex } from "stream";
import { Decorator, NodeCallback, Callback } from "./typedefs";

export class WSStream extends Writable {
    private _decoder: NodeStringDecoder
    private _data: string;
    constructor(options?: { [opt: string]: any }) {
        super(options);
        this._decoder = new StringDecoder(options && options.defaultEncoding);
        this._data = '';
    }
    get data() {
        return this._data;
    }
    _write(chunk: any, encoding: string, callback: Callback<any>) {
        if (encoding === 'buffer') {
            chunk = this._decoder.write(chunk);
        }
        this._data += chunk;
        callback();
    }
    _final(callback: Function) {
        this._data += this._decoder.end();
        callback();
    }
}

class StringStream extends Duplex {
    private _data: string = '';
    _write(chunk: Buffer | string, encoding: string, callback: Callback<any>) {
        if (Buffer.isBuffer(chunk))
            chunk = chunk.toString();
        this._data += chunk;
        callback();
    }
    _read(size?: number) {
        if(this._data.length >= size)
            this.push(Buffer.from(this._data));
    }
}