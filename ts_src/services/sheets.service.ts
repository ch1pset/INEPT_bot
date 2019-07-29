import { sheets } from '../../config.json';
import * as https from 'https';
import { GRequest } from './sheets/api'
import { Link } from '../bot/modules';
import { NodeCallback } from '../utils/typedefs.js';
import { StringStream } from '../utils/streams.js';

export class Sheets {
    static getSheet([name, range]: [string, string], cb?: NodeCallback<Error, string[][]>) {
        const options = new GRequest(sheets[name], range);
        const sstream = new StringStream();
        const req = https.request(
            options,
            res => res.pipe(sstream)
                .on('finish', () => {
                    if(res.statusCode === 200) {
                        cb(null, JSON.parse(sstream.data).values)
                    } else cb(new Error(`Sheet not found!`));
                })
                .on('error', e => cb(e)));
        req.end();
    }
}

Sheets.getSheet(
    ['guides', 'A:F'],
    (err, values) => {
        if(!err) {
            console.log(values.slice(1));
            values.slice(1).forEach(([name, url, op, date, diff, cat]) => {
                const link = new Link(name, url, op, date);
            })
        } else {
            console.log(err);
        }
    }
)