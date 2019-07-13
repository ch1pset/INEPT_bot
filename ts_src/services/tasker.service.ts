import { AsyncTaskQueue, Status, Task } from "../utils";
import { Logger } from "./logger.service";

export class Tasker {
    private _tasks = new AsyncTaskQueue(2000);

    constructor(private logger: Logger) { }

    queue(task: Task) {
        this.logger.info(`Queueing ${task.name}...`);
        this._tasks.queue(task);
        if(this._tasks.isReady || this._tasks.status === Status.NULL) {
            this.logger.info(`Running task queue...`);
            this._tasks.run();
        }
    }

    clear() {
        this.logger.info(`Task queue cleared.`);
        this._tasks.clear();
    }
}