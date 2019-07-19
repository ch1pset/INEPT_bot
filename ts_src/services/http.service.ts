import * as https from 'https';
import { Logger } from '.';
import { IRequest, AsyncStatus, Status, Callback } from '../utils';
import { IncomingMessage } from 'http';

export class HttpsRequest implements AsyncStatus {
    on: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    once: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    off: (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    emit: (event: Status | "ready" | "busy" | "error" | "null", ...args: any[]) => boolean;
    status: Status;
    ready: () => Status;
    busy: () => Status;
    error: (err: Error) => Status;
    isReady: boolean;
    isBusy: boolean;
    failed: boolean;

    constructor(private logger: Logger) {}

    get(reqOptions: IRequest) {

    }

    post(reqOptions: IRequest) {

    }

    put(reqOptions: IRequest) {
        
    }

    patch(reqOptions: IRequest) {

    }

    options(reqOptions: IRequest) {

    }
}