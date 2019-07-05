import * as fs from 'fs';
import { Callback, NodeCallback } from './typedefs';
import { Subscribable } from './subscriber';
import { Mixin } from './decorators';
import { AsyncStat, Stat } from './asyncstat';

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

    constructor(fname: string) {
        this.loadFromFile(fname, (err, dict) => {

        })
    }

    get array() {
        const arr = [];
        for(let key in this) {
            arr.push(this[key]);
        }
        return arr;
    }
    get size() {
        let count = 0;
        for(let k in this) count++;
        return count;
    }
    set(key: string, value: T) {
        this[key.toLowerCase()] = value;
    }
    get(key: string) {
        if(this.has(key)) {
            const value = <T>{};
            Object.assign(value, this[key.toLowerCase()]);
            return value;
        } else return null;
    }
    has(key: string) {
        return this[key.toLowerCase()] ? true : false;
    }
    delete(key: string) {
        this[key.toLowerCase()] = undefined;
        delete this[key.toLowerCase()];
    }
    forEach(cb: Callback<void>) {
        for(let key in this) {
            cb(this.get(key), key);
        }
    }
    find(cb: Callback<boolean>) {
        for(let key in this) {
            if(cb(this.get(key), key))
                return this.get(key);
        }
        return null;
    }
    writeToFile(fname: string, cb: NodeCallback<Error, Dictionary<T>>) {
        console.log(`Writing to ${fname}`);
        this.busy();
        fs.writeFile(
            fname,
            JSON.stringify(this, null, 4),
            err => {
                if(!err) {
                    this.consume('done', this.ready());
                    cb(null, this);
                } else {
                    this.consume('done', this.error());
                    cb(err, null);
                }
            });
    }
    loadFromFile(fname: string, cb: NodeCallback<Error, Dictionary<T>>) {
        console.log(`Reading from ${fname}`);
        this.busy();
        fs.readFile(
            fname,
            'utf8',
            (err, data) => {
            if(!err) {
                const temp = JSON.parse(data);
                Object.assign(this, temp);
                this.consume('done', this.ready());
                cb(null, this);
            } 
            else cb(err, null)});
    }
}