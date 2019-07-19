import { Writable, Duplex } from "stream";
import { Callback } from "./typedefs";
import { TextChannel } from "discord.js";
import { AsyncStatus, Status } from "./asyncstat";
import { Mixin } from "./decorators";

@Mixin([AsyncStatus])
export class StringStream extends Duplex implements AsyncStatus {
    status: Status;
    ready: () => Status;
    busy: () => Status;
    error: (err: Error) => Status;
    isReady: boolean;
    isBusy: boolean;
    failed: boolean;
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