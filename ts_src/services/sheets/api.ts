import { api } from '../../../config.json';
import { URLSearchParams } from 'url';
import { IRequest } from '../../utils/rest';

export class GRequest implements IRequest {
    hostname = 'sheets.googleapis.com';
    path = '/v4/spreadsheets';
    headers: {
        'Accept': 'application/json'
    }
    constructor(id: string, range: string) {
        const query = new URLSearchParams();
        query.set('key', api.google.sheets);
        this.path += '/' + id;
        this.path += '/values/' + range.replace(':', '%3A');
        this.path += '?' + query.toString();
    }
}
