import { Mixin, Callback } from ".";
import { EventEmitter } from "events";

@Mixin([EventEmitter])
export class Task {
    on:     (event: 'done' | 'error', listener: Callback<void>) => this;
    once:   (event: 'done' | 'error', listener: Callback<void>) => this;
    off:    (event: 'done' | 'error', listener: Callback<void>) => this;
    emit:   (event: 'done' | 'error', ...args: any[]) => boolean;

    private _task: (thisArg: Task) => void;
    private constructor(task: (thisArg: Task) => void) {
        this._task = task;
    }
    static create(task: (thisArg: Task) => void) {
        return new Task(task);
    }
    get name() {
        return this._task.name;
    }
    done() {
        this.emit('done');
    }
    error(err: Error) {
        this.emit('error', err);
    }
    run() {
        this._task(this);
        return this;
    }
}