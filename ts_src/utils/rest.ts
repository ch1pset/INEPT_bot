import { RequestOptions, OutgoingHttpHeaders } from "http";

export interface IRequest extends RequestOptions {
    hostname:       string;
    path:           string;
    headers:        OutgoingHttpHeaders;
    method?:        string;
}

export type QueryParam = [string, string];

export class Query extends URLSearchParams{
    private constructor(params?: QueryParam[]) {
        super(params);
    }
    static generate(params: QueryParam[]) {
        return '?' + (new Query(params)).toString();
    }
    static create() {
        return new Query();
    }
}