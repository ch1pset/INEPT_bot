import { NodeStringDecoder, StringDecoder } from "string_decoder";
import { Writable, Duplex } from "stream";
import { Decorator, NodeCallback, Callback } from "./typedefs";
import { TextChannel, DMChannel, TextBasedChannel } from "discord.js";

export class StringStream extends Duplex {
    private _data: string = '';
    get data() {
        return this._data.slice();
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

export class ChannelStream extends Writable {
    private _ch: TextChannel;
    constructor(channel: TextChannel) {
        super();
        this._ch = channel;
    }
    _write(chunk: Buffer | string, encoding: string, callback: Callback<any>) {
        if(Buffer.isBuffer(chunk))
            chunk = chunk.toString();
        this._ch.send(chunk);
        callback();
    }
}