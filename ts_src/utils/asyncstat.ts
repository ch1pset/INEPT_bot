
export enum Stat {
    NULL = 'null',
    READY = 'ready',
    BUSY = 'busy',
    ERROR = 'error',
}

export class AsyncStat {
    status: Stat = Stat.NULL;
    ready() {
        return this.status = Stat.READY;
    }
    busy() {
        return this.status = Stat.BUSY;
    }
    error() {
        return this.status = Stat.ERROR;
    }
    get isReady() {
        return this.status === Stat.READY;
    }
    get isBusy() {
        return this.status === Stat.BUSY;
    }
    get failed() {
        return this.status === Stat.ERROR;
    }
}