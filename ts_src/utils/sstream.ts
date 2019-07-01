import { NodeStringDecoder, StringDecoder } from "string_decoder";
import { Writable, Readable } from "stream";
import { fn, Decorator, NodeCallback, Callback } from "./typedefs";

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
    _write(chunk: any, encoding: string, callback: Function) {
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

export class RSStream extends Readable {
    constructor(options?: { [opt: string]: any }) {
        super(options);
        
    }
    _read(size: number) {
        
    }
}

// export function Streamable(options?: { [opt: string]: any }): Decorator<Constructor> {
//     return function(target, key) {

//     }
// }