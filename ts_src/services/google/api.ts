import * as config from '../../../config.json';
import * as https from 'https';
import { URLSearchParams } from 'url';
import { IRequest, StringStream } from '../../utils';

export class GRequest implements IRequest {
    hostname = 'sheets.googleapis.com';
    path = '/v4/spreadsheets';
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
    data: {}
    constructor(id: string, range?: string, data?: {}) {
        const query = new URLSearchParams();
        query.set('key', config.auth.api.google);
        this.path += '/' + id;
        this.path += '/values/' + range.replace(':', '%3A');
        this.path += '?' + query.toString();
        this.data = data;
    }
}

// const options1 = new GRequest('GET', sheets.guides, 'A:F');
// const sstream = new StringStream();
// const req1 = https.request(
//     options1,
//     res => res.pipe(sstream)
//         .on('finish', () => {
//             console.log(sstream.data);
//         })
//         .on('error', (e) => {
//             console.log(e);
//         })
// );
// req1.end();

// const options2 = GRequest.create('POST', sheets.guides, 'A:F', {
//     "majorDimension": "ROWS",
//     "range": "A:F",
//     "values": [
//         'test',
//         'https://example.com',
//         (new Date(Date.now())).toISOString().split('T')[0],
//         'Easy',
//         'None'
//     ]
// });
// const req2 = https.request(
//     options2,
//     res => res.pipe(sstream)
//         .on('finish', () => {
//             console.log(sstream.data);
//         })
//         .on('error', (e) => {
//             console.log(e);
//         })
// )
// req2.end();


// POST /[SPREADSHEETID]/values/[RANGE]:append?key=[YOUR_API_KEY] HTTP/1.1
// 
// Authorization: Bearer [YOUR_ACCESS_TOKEN]
// Accept: application/json
// Content-Type: application/json
