import * as https from 'https';
import { Logger } from '.';
import { IRequest, AsyncStatus, Status, Callback, StringStream } from '../utils';
import { IncomingMessage } from 'http';

export class HttpsRequest {
    static default = new HttpsRequest(Logger.default);
    constructor(private logger: Logger) {}

    get({reqOptions, success, error}: {reqOptions: IRequest, success: Callback<void>, error?: Callback<void>}) {
        const sstream = new StringStream();
        https.get(
            reqOptions,
            res => {
                if(res.statusCode === 200) {
                    res.pipe(sstream)
                    .once('finish', () => success(sstream.obj))
                    .on('error', err => error(err));
                }
                else error(res.statusMessage);
            })
        .on('error', err => error(err));
    }
}