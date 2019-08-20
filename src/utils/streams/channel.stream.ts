import { Writable } from "stream";
import { Callback } from "../typedefs";
import { TextChannel } from "discord.js";

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