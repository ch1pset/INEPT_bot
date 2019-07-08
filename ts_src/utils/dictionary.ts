import * as fs from 'fs';
import { Callback, NodeCallback, bool } from './typedefs';
import { Subscribable } from './subscriber';
import { Mixin } from './decorators';
import { AsyncStat, Stat } from './asyncstat';
import { Logger } from '../services';

@Mixin([Subscribable, AsyncStat])
export class Dictionary<T> implements Subscribable, AsyncStat {

    status: Stat;
    ready: () => Stat;
    busy: () => Stat;
    error: () => Stat;
    isReady: boolean;
    isBusy: boolean;
    failed: boolean;

    _subscriptions: Map<string, Callback<any>[]>;
    subscriptions: Map<string, Callback<any>[]>;
    when: (event: string, cb: Callback<any>) => Subscribable;
    recall: (event: string, cb: Callback<any>) => Subscribable;
    dispatch: (event: string, ...args: any[]) => Subscribable;
    consume: (event: string, ...args: any[]) => Subscribable;

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
    set(key: string, value: T): void {
        this[key.toLowerCase()] = value;
    }
    get(key: string): T {
        if(this.has(key)) {
            const value = <T>{};
            Object.assign(value, this[key.toLowerCase()]);
            return value;
        } else return null;
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
    writeToFile(fname: string, cb: NodeCallback<Error, Dictionary<T>>): void {
        Logger.default.info(`Writing to ${fname}`);
        this.busy();
        fs.writeFile(
            fname,
            JSON.stringify(this, (key, val)=> key === 'status' ? undefined : val, 4),
            err => {
                if(!err) {
                    // this.consume('done', this.ready());
                    this.ready();
                    cb(null, this);
                } else {
                    // this.consume('error', this.error());
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
                    // this.consume('loaded', this.ready(), this);
                    cb(null, this);
                } else {
                    // this.consume('error', this.error(), err);
                    this.error();
                    cb(err, null);
                }});
    }
}