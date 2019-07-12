import { EventEmitter } from "events";
import { Logger } from "../services";
import { Mixin } from "./decorators";
import { Callback } from ".";


export type status_str = 'ready' | 'busy' | 'error' | 'null';
export enum Status {
    NULL = 'null',
    READY = 'ready',
    BUSY = 'busy',
    ERROR = 'error',
}

@Mixin([EventEmitter])
export class AsyncStat implements EventEmitter {
    on:                     (event:  Status | status_str, listener: Callback<void>) => this;
    once:                   (event:  Status | status_str, listener: Callback<void>) => this;
    off:                    (event:  Status | status_str, listener: Callback<void>) => this;
    addListener:            (event:  Status | status_str, listener: Callback<void>) => this;
    prependListener:        (event:  Status | status_str, listener: Callback<void>) => this;
    prependOnceListener:    (event:  Status | status_str, listener: Callback<void>) => this;
    removeListener:         (event:  Status | status_str, listener: Callback<void>) => this;
    listeners:              (event:  Status | status_str) => Function[];
    rawListeners:           (event:  Status | status_str) => Function[];
    emit:                   (event:  Status | status_str) => boolean;
    removeAllListeners:     (event?: Status | status_str) => this;
    listenerCount:          (type:   Status | status_str) => number;
    eventNames:             () =>   (Status | status_str)[];
    getMaxListeners:        () => number;
    setMaxListeners:        (n: number) => this;

    status: Status = Status.NULL;
    ready() {
        this.emit(Status.READY);
        return this.status = Status.READY;
    }
    busy() {
        this.emit(Status.BUSY);
        return this.status = Status.BUSY;
    }
    error() {
        this.emit(Status.ERROR);
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