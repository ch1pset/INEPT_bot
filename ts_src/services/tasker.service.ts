import { AsyncTaskQueue, Status, Task } from "../utils";
import { Logger } from "./logger.service";

export class Tasker {
    private _tasks = new AsyncTaskQueue(2000);

    constructor(private logger: Logger) { }

    queue(task: Task) {
        this._tasks.queue(task);
        if(this._tasks.isReady || this._tasks.status === Status.NULL) {
            this._tasks.run();
        }
    }

    clear() {
        this._tasks.clear();
    }
}