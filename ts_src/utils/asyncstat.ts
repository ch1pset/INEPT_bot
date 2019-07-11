import { EventEmitter } from "events";
import { Logger } from "../services";

export enum Status {
    NULL = 'null',
    READY = 'ready',
    BUSY = 'busy',
    ERROR = 'error',
}

export class AsyncStat {
    status: Status = Status.NULL;
    ready() {
        return this.status = Status.READY;
    }
    busy() {
        return this.status = Status.BUSY;
    }
    error() {
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