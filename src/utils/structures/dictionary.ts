import * as fs from 'fs';
import { Callback, NodeCallback, bool } from '../typedefs';
import { Mixin } from '../decorators';
import { AsyncStatus, Status } from '../events';
import { Logger } from '../../services';

@Mixin(AsyncStatus)
export class Dictionary<T> implements AsyncStatus {
    on: (event: Status | "ready" | "busy" | "error" | "null", listener: () => void) => this;
    once: (event: Status | "ready" | "busy" | "error" | "null", listener: () => void) => this;
    off: (event: Status | "ready" | "busy" | "error" | "null", listener: () => void) => this;
    emit: (event: Status | "ready" | "busy" | "error" | "null", ...args: any[]) => boolean;

    status: Status;
    ready: (...args: any[]) => this;
    busy: () => this;
    error: (err: Error) => this;
    isReady: boolean;
    isBusy: boolean;
    failed: boolean;

    private _data = {};

    get array(): T[] {
        const arr = [];
        for(let key in this._data) {
            arr.push(this._data[key]);
        }
        return arr;
    }
    get size(): number {
        return Object.keys(this._data).length;
    }
    keys(): string[] {
        const karr = [];
        for(let key in this._data) {
            karr.push(key);
        }
        return karr;
    }
    values(): T[] {
        const tarr = [];
        for(let t in this._data) {
            tarr.push(t);
        }
        return tarr;
    }
    set(key: string, value: T): void {
        this._data[key.toLowerCase()] = value;
    }
    get(key: string): T {
        return this._data[key.toLowerCase()];
    }
    has(key: string): bool {
        return this._data[key.toLowerCase()] || false;
    }
    delete(key: string): bool {
        this._data[key.toLowerCase()] = undefined;
        return delete this[key.toLowerCase()];
    }
    forEach(cb: Callback<void>): void {
        for(let key in this._data) {
            cb(this.get(key), key);
        }
    }
    find(cb: Callback<boolean>): T {
        for(let key in this._data) {
            if(cb(this.get(key), key))
                return this.get(key);
        }
        return null;
    }
    map(cb: Callback<any>): any[] {
        const arr = [];
        for(let key in this._data) {
            arr.push(cb(this.get(key), key));
        }
        return arr;
    }
    writeToFile(fname: string, cb: NodeCallback<Error, Dictionary<T>>): void {
        Logger.default.info(`Writing to ${fname}`);
        this.busy();
        let file = fs.createWriteStream(fname);
        file.write(
            JSON.stringify(this._data, null, 4),
            err => {
                if(!err) {
                    this.ready();
                    cb(null, this);
                } else {
                    this.error(err);
                    cb(err, null);
                }
            });
    }
    loadFromFile(fname: string, cb: NodeCallback<Error, Dictionary<T>>): void {
        Logger.default.info(`Reading from ${fname}`);
        this.busy();
        fs.readFile(
            fname,
            'utf8',
            (err, data) => {
                if(!err) {
                    const temp = JSON.parse(data);
                    Object.assign(this._data, temp);
                    this.ready();
                    cb(null, this);
                } else {
                    this.error(err);
                    cb(err, null);
                }});
    }
}