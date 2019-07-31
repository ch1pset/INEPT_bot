import { sheets } from '../../config.json';
import * as https from 'https';
import { GRequest } from './sheets/api'
import { Link } from '../bot/modules';
import { NodeCallback } from '../utils/typedefs';
import { StringStream } from '../utils/streams';

type guide = [string, string, string, string, string, string];

@Mixin([AsyncStatus])
export class Sheet<T> implements AsyncStatus {
    eventNames: () => (string | symbol)[];
    on:     (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    once:   (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    off:    (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    emit:   (event: Status | "ready" | "busy" | "error" | "null", ...args: any[]) => boolean;
    status:  Status;
    ready: () => Status;
    busy: () => Status;
    error: (err: Error) => Status;
    isReady: boolean;
    isBusy: boolean;
    failed: boolean;

    private _data: T[][];

    constructor(
        private id: string,
        private range: string
    ) { }

    get(cb?: NodeCallback<Error, T[][]>) {
        this.busy();
        const options = new GRequest(this.id, this.range);
        const sstream = new StringStream();
        const req = https.request(
            options,
            res => res.pipe(sstream)
                .on('finish', () => {
                    if(res.statusCode === 200) {
                        this.ready();
                        cb(null, JSON.parse(sstream.data).values)
                    } else {
                        const err = new Error(`Sheet not found!`);
                        this.error(err);
                        cb(err);
                    }
                })
                .on('error', e => {
                    this.error(e);
                    cb(e)
                }));
        req.end();
        return this;
    }
    
    search(cb: (value: T[]) => T[][]) {
        this.once('ready', () => {
            const results = this._data.filter(row => {
                return cb(row)
            })
        })
    }
}

// const Guides = new Sheet<guide>(sheets.guides, 'A:F');
// Guides.get(
//     (err, values) => {
//         if(!err) {
//             console.log(values.slice(1));
//             values.slice(1).forEach(([name, url, op, date, diff, cat]) => {

//             })
//         } else {
//             console.log(err);
//         }
//     }
// )