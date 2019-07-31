import { RequestOptions, OutgoingHttpHeaders } from "http";
import { URLSearchParams } from "url";

export interface IRequest extends RequestOptions {
    hostname:       string;
    path:           string;
    headers:        OutgoingHttpHeaders;
    method?:        string;
    body?:          any;
}

export type QueryParam = [string, string];

export function createQuery(params: QueryParam[]) {
    return '?' + (new URLSearchParams(params)).toString();
}
