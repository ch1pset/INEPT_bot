import { Callback } from ".";
import { AsyncStatus, Status } from "./asyncstat";
import { Mixin } from "./decorators";
import { Logger } from "../services";
import { EventEmitter } from "events";

@Mixin([EventEmitter])
export class Task implements EventEmitter {
    on:                     (event: 'done', listener: Callback<void>) => this;
    once:                   (event: 'done', listener: Callback<void>) => this;
    off:                    (event: 'done', listener: Callback<void>) => this;
    addListener:            (event: 'done', listener: Callback<void>) => this;
    prependListener:        (event: 'done', listener: Callback<void>) => this;
    prependOnceListener:    (event: 'done', listener: Callback<void>) => this;
    removeListener:         (event: 'done', listener: Callback<void>) => this;
    listeners:              (event: 'done') => Function[];
    rawListeners:           (event: 'done') => Function[];
    emit:                   (event: 'done', ...args: any[]) => boolean;
    removeAllListeners:     (event?:'done') => this;
    listenerCount:          (type:  'done') => number;
    eventNames:             () => ( 'done')[];
    getMaxListeners:        () => number;
    setMaxListeners:        (n: number) => this;

    private _task: (thisArg: Task) => void;
    constructor(task: (thisArg: Task) => void) {
        this._task = task;
    }
    get name() {
        return this._task.name;
    }
    done() {
        this.emit('done');
    }
    run() {
        this._task(this);
        return this;
    }
}

 @Mixin([AsyncStatus])
export class AsyncTaskQueue implements AsyncStatus {
    status:     Status;
    ready:      () => Status;
    busy:       () => Status;
    error:      () => Status;
    isReady:    boolean;
    isBusy:     boolean;
    failed:     boolean;

    on: (event: Status | "ready" | "busy" | "error" | "null",  listener: Callback<void>) => this;
    once: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    off: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    addListener: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    prependListener: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    prependOnceListener: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    removeListener: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    listeners: (event: Status | "ready" | "busy" | "error" | "null") => Function[];
    rawListeners: (event: Status | "ready" | "busy" | "error" | "null") => Function[];
    emit: (event: Status | "ready" | "busy" | "error" | "null", ...args: any[]) => boolean;
    removeAllListeners: (event?: Status | "ready" | "busy" | "error" | "null") => this;
    listenerCount: (type: Status | "ready" | "busy" | "error" | "null") => number;
    eventNames: () => (Status | "ready" | "busy" | "error" | "null")[];
    getMaxListeners: () => number;
    setMaxListeners: (n: number) => this;

    private _queue: Task[] = [];
    private _timeout: number;
    private _onRun(timeout: number) {
        return new Promise<Status>((resolve) => {
            setTimeout(
                () => {
                    const task = this.firstInQueue();
                    if(task) {
                        task.once('done', () => resolve());
                        task.run();
                    } else {
                        resolve();
                    }
                }, timeout);
        });
    }

    constructor(timeout: number, onRun?: (timeout: number) => Promise<Status>) {
        onRun ? this._onRun = onRun : null;
        this._timeout = timeout;
    }

    private async run() {
        Logger.default.info(`Running task queue...`);
        this.busy();
        while(this.length && !this.failed) {
            await this._onRun(this._timeout);
        }
        if(!this.failed) this.ready();
    }
    
    get length(): number {
        return this._queue.length;
    }
    
    firstInQueue(): Task {
        return this._queue.shift();
    }

    queue(task: Task) {
        this._queue.push(task);
        Logger.default.info(`Executing ${task.name ? task.name : task.toString()} in ${this._timeout} ms`);
        if(this.isReady || this.status === Status.NULL) {
            this.run();
        }
    }

    clear() {
        this._queue.splice(0);
    }
}

// const tasker = new AsyncTaskQueue(1000);
// function justDoIt(t: Task) {
//     console.log(`Begin task.`);
//     setTimeout(() => {
//         console.log(`Task complete.`);
//         t.done();
//     }, 2000)
// }
// const task = new Task(justDoIt);

// tasker.on(Status.READY, () => {
//     Logger.default.info(`No tasks in queue.`);
//     setTimeout(() => {
//         tasker.queue(task);
//     }, 2000);
// });

// tasker.ready();