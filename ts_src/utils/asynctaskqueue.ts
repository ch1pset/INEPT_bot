import { Callback } from ".";
import { AsyncStatus, Status } from "./asyncstat";
import { Mixin } from "./decorators";
import { Task } from "./task";

 @Mixin([AsyncStatus])
export class AsyncTaskQueue implements AsyncStatus {
    status:     Status = Status.NULL;
    ready:      () => Status;
    busy:       () => Status;
    error:      () => Status;
    isReady:    boolean;
    isBusy:     boolean;
    failed:     boolean;
    on:         (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    once:       (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    off:        (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    emit:       (event: Status | "ready" | "busy" | "error" | "null", ...args: any[]) => boolean;

    private _timeout: number;
    private _queue: Task[] = [];
    private _onRun(timeout: number) {
        return new Promise<Status>((resolve, reject) => {
            setTimeout(
                () => {
                    const task = this.dequeue();
                    if(task) 
                        task.once('done', resolve)
                            .once('error', reject)
                            .run();
                    else resolve();
                }, timeout);
        });
    }
    
    constructor(timeout: number, onRun?: (timeout: number) => Promise<Status>) {
        onRun ? this._onRun = onRun : null;
        this._timeout = timeout;
    }

    async run() {
        this.busy();
        while(this.length && !this.failed) {
            await this._onRun(this._timeout);
        }
        if(!this.failed) this.ready();
    }
    
    get length(): number {
        return this._queue.length;
    }

    set timeout(t_ms: number) {
        this._timeout = t_ms;
    }
    
    dequeue(): Task {
        return this._queue.shift();
    }

    queue(task: Task) {
        this._queue.push(task);
        return this;
    }

    clear() {
        this._queue.splice(0);
        return this;
    }
}