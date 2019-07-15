import { RequestOptions, OutgoingHttpHeaders } from "http";

export interface IRequest extends RequestOptions {
    hostname:       string;
    path:           string;
    headers:        OutgoingHttpHeaders;
    method?:        string;
}