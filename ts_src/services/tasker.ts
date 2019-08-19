
import { Logger } from "./logger";
import { AsyncTaskQueue } from "../utils/structures";
import { Task, Status } from "../utils/events";

export class Tasker {
    private _tasks = new AsyncTaskQueue(2000);

    constructor(private logger: Logger) { }

    set interval(t_ms: number) {
        this._tasks.timeout = t_ms;
    }

    queue(task: Task) {
        this.logger.info(`Queueing ${task.name}...`);
        this._tasks.queue(task);
        if(this._tasks.isReady || this._tasks.status === Status.NULL) {
            this.logger.info(`Running task queue...`);
            this._tasks.run();
        }
        return this;
    }

    repeat(task: Task, interval: number) {
        this.logger.info(`Running ${task.name} on interval...`);
        this.interval = interval;
        this._tasks.on('ready', 
            () => this._tasks.queue(task).run())
            .ready();
        return this;
    }

    clear() {
        this.logger.info(`Task queue cleared.`);
        this._tasks.clear();
    }
}