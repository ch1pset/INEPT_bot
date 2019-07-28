import * as https from 'https';
import { Logger } from '.';
import { IRequest, Callback, StringStream } from '../utils';

export type HttpsRequestParams = {request?: IRequest, success: Callback<void>, error?: Callback<void>, [name: string]: any};
export type HttpsRequestBody = {[name: string]: any};

export class HttpsRequest {
    static default = new HttpsRequest(Logger.default);
    constructor(private logger: Logger) {}

    get({request, success, error}: HttpsRequestParams) {
        const sstream = new StringStream();
        https.get(
            request,
            res => {
                if(res.statusCode === 200) {
                    res.pipe(sstream)
                    .once('finish', () => success(sstream.obj))
                    .once('error', err => error(err));
                }
                else error(res.statusMessage);
            })
        .once('error', err => error(err));
    }

    post({request, body, success, error}: HttpsRequestParams) {
        const sstream = new StringStream();
        request.method = 'POST';
        request.body = body;
        https.request(
            request,
            res => {

            })
        .end();
        return sstream;
    }
}
