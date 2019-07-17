import { Mixin, Callback } from ".";
import { EventEmitter } from "events";


@Mixin([EventEmitter])
export class SimpleEventEmitter {
    on: (event: string | symbol, listener: Callback<void>) => this;
    once: (event: string | symbol, listener: Callback<void>) => this;
    off: (event: string | symbol, listener: Callback<void>) => this;
    emit: (event: string | symbol, ...args: any[]) => boolean;
}