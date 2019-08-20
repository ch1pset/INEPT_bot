import { Duplex } from "stream";
import { Callback } from "../typedefs";

export class StringStream extends Duplex {
    private _data: string = '';
    get data() {
        return this._data.slice();
    }
    get obj() {
        return JSON.parse(this._data);
    }
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