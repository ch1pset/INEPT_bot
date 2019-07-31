import { Mixin } from "../decorators";
import { Callback } from "../typedefs";
import { SimpleEventEmitter } from "./simple.events";


export type status_str = 'ready' | 'busy' | 'error' | 'null';
export enum Status {
    NULL = 'null',
    READY = 'ready',
    BUSY = 'busy',
    ERROR = 'error',
}

@Mixin([SimpleEventEmitter])
export class AsyncStatus implements SimpleEventEmitter {
    on:     (event:  Status | status_str, listener: Callback<void>) => this;
    once:   (event:  Status | status_str, listener: Callback<void>) => this;
    off:    (event:  Status | status_str, listener: Callback<void>) => this;
    emit:   (event:  Status | status_str, ...args: any[]) => boolean;

    status: Status = Status.NULL;
    ready(...args: any[]) {
        this.emit(Status.READY, ...args);
        return this.status = Status.READY;
    }
    busy() {
        this.emit(Status.BUSY);
        return this.status = Status.BUSY;
    }
    error(err: Error) {
        this.emit(Status.ERROR, err);
        return this.status = Status.ERROR;
    }
    get isReady() {
        return this.status === Status.READY;
    }
    get isBusy() {
        return this.status === Status.BUSY;
    }
    get failed() {
        return this.status === Status.ERROR;
    }
}