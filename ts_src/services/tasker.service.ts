import { AsyncTaskQueue, Task } from "../utils/asynctaskqueue";
import { Logger } from "./logger.service";

export class Tasker {
    private _tasks = new AsyncTaskQueue(2000);

    constructor(private logger: Logger) { }

    queue(task: Task) {
        this._tasks.queue(task);
    }

    clear() {
        this._tasks.clear();
    }
}