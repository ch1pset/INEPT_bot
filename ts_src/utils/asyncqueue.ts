import { Callback } from ".";
import { AsyncStat, Status } from "./asyncstat";
import { Mixin } from "./decorators";
import { Logger } from "../services";

 @Mixin([AsyncStat])
export class AsyncTaskQueue implements AsyncStat {
    status:     Status;
    ready:      () => Status;
    busy:       () => Status;
    error:      () => Status;
    isReady:    boolean;
    isBusy:     boolean;
    failed:     boolean;

     on: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
     once: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
     off: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
     addListener: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
     prependListener: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
     prependOnceListener: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
     removeListener: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
     listeners: (event: Status | "ready" | "busy" | "error" | "null") => Function[];
     rawListeners: (event: Status | "ready" | "busy" | "error" | "null") => Function[];
     emit: (event: Status | "ready" | "busy" | "error" | "null") => boolean;
     removeAllListeners: (event?: Status | "ready" | "busy" | "error" | "null") => this;
     listenerCount: (type: Status | "ready" | "busy" | "error" | "null") => number;
     eventNames: () => (Status | "ready" | "busy" | "error" | "null")[];
     getMaxListeners: () => number;
     setMaxListeners: (n: number) => this;

    private _queue: Callback<any>[] = [];

    get length(): number {
        return this._queue.length;
    }
    
    get firstInQueue(): Callback<any> {
        return this._queue.shift();
    }

    private async run() {
        Logger.default.info(`Running task queue...`);
        while(this.length && !this.failed) {
            this.busy();
            await new Promise<Status>(
                (res, rej) => {
                    const onTimeout = () => {
                        try {
                            this.firstInQueue();
                            res(Status.READY);
                        } catch(e) {
                            rej(Status.ERROR);
                            this.error();
                        }
                    }
                    setTimeout(onTimeout, 2000)});
        }
        if(!this.failed) this.ready();
    }

    queue(task: Callback<any>) {
        this._queue.push(task);

        if(this.isReady || this.status === Status.NULL) {
            this.run();
        }
    }
}

// const tasker = new AsyncTaskQueue();

// function task(num: number) {
//     return () => console.log(`Task ${num} complete`);
// }

// tasker.on(Status.READY, () => {
//     setTimeout(() => {
//         tasker.queue(task(1));
//         tasker.queue(task(2));
//         tasker.queue(task(3));
//         tasker.queue(task(4));
//     }, 2000);
// });

// tasker.ready();