import { api } from '../../../config.json';
import { URLSearchParams } from 'url';
import { IRequest } from '../../utils/http/rest';

export type SheetsRequestParams = {method?: string, body?: {[name: string]: any}, sheet: [string, string]};

export function request({method, body, sheet:[id, range]}: SheetsRequestParams): IRequest {
    var route = '/' + id;
    route += '/values/' + range.replace(':', '%3A');
    const query = new URLSearchParams([['key', api.google.sheets]]).toString();
    return {
        hostname: 'sheets.googleapis.com',
        path: '/v4/spreadsheets' + route + '?' + query,
        headers: {
            'Accept': 'application/json'
        },
        method,
        body: body ? body : {}
    }
}
