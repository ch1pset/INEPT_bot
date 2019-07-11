import { Callback } from ".";
import { bool } from "./typedefs";
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

        if(this.isReady) {
            this.run();
        }
    }
}

const tasker = new AsyncTaskQueue();
tasker.ready();

function task(num: number) {
    return () => console.log(`Task ${num} complete`);
}

tasker.queue(task(1));
tasker.queue(task(2));
tasker.queue(task(1));
tasker.queue(task(2));

