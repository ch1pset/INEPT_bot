import { Mixin } from "../decorators";
import { Callback } from '../typedefs';
import { SimpleEventEmitter } from "./simple.events";

@Mixin([SimpleEventEmitter])
export class Task implements SimpleEventEmitter {
    eventNames: () => (string | symbol)[];
    on:     (event: 'done' | 'error', listener: Callback<void>) => this;
    once:   (event: 'done' | 'error', listener: Callback<void>) => this;
    off:    (event: 'done' | 'error', listener: Callback<void>) => this;
    emit:   (event: 'done' | 'error', ...args: any[]) => boolean;

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
    error(err: Error) {
        this.emit('error', err);
    }
    run() {
        this._task(this);
        return this;
    }
}