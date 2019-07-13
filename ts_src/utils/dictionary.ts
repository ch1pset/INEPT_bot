import * as fs from 'fs';
import { Callback, NodeCallback, bool } from './typedefs';
import { Subscribable } from './subscriber';
import { Mixin } from './decorators';
import { AsyncStatus, Status } from './asyncstat';
import { Logger } from '../services';

@Mixin([AsyncStatus])
export class Dictionary<T> implements AsyncStatus {
    on: (event: Status | "ready" | "busy" | "error" | "null", listener: () => void) => this;
    once: (event: Status | "ready" | "busy" | "error" | "null", listener: () => void) => this;
    off: (event: Status | "ready" | "busy" | "error" | "null", listener: () => void) => this;
    emit: (event: Status | "ready" | "busy" | "error" | "null", ...args: any[]) => boolean;

    status: Status;
    ready: () => Status;
    busy: () => Status;
    error: () => Status;
    isReady: boolean;
    isBusy: boolean;
    failed: boolean;

    get array(): T[] {
        const arr = [];
        for(let key in this) {
            arr.push(this[key]);
        }
        return arr;
    }
    get size(): number {
        return Object.keys(this).length;
    }
    keys(): string[] {
        const karr = [];
        for(let key in this) {
            karr.push(key);
        }
        return karr;
    }
    values(): T[] {
        const tarr = [];
        for(let t in this) {
            tarr.push(t);
        }
        return tarr;
    }
    set(key: string, value: T): void {
        this[key.toLowerCase()] = value;
    }
    get(key: string): T {
        return this[key.toLowerCase()];
    }
    has(key: string): bool {
        return this[key.toLowerCase()] || false;
    }
    delete(key: string): bool {
        this[key.toLowerCase()] = undefined;
        return delete this[key.toLowerCase()];
    }
    forEach(cb: Callback<void>): void {
        for(let key in this) {
            cb(this.get(key), key);
        }
    }
    find(cb: Callback<boolean>): T {
        for(let key in this) {
            if(cb(this.get(key), key))
                return this.get(key);
        }
        return null;
    }
    map(cb: Callback<any>): any[] {
        const arr = [];
        for(let key in this) {
            arr.push(cb(this.get(key), key));
        }
        return arr;
    }
    writeToFile(fname: string, cb: NodeCallback<Error, Dictionary<T>>): void {
        Logger.default.info(`Writing to ${fname}`);
        this.busy();
        fs.writeFile(
            fname,
            JSON.stringify(this, (key, val)=> key === 'status' ? undefined : val, 4),
            err => {
                if(!err) {
                    this.ready();
                    cb(null, this);
                } else {
                    this.error();
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
                    Object.assign(this, temp);
                    this.ready();
                    cb(null, this);
                } else {
                    this.error();
                    cb(err, null);
                }});
    }
}