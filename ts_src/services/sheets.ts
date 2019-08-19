import * as Sheets from './sheets/request'
import { Mixin } from '../utils/decorators';
import { Callback } from '../utils/typedefs';
import { AsyncStatus, Status } from '../utils/events';
import { HttpsRequest } from './http';
import { Logger } from './logger';

@Mixin([AsyncStatus])
export class Sheet<T> implements AsyncStatus {
    on:     (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    once:   (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    off:    (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    emit:   (event: Status | "ready" | "busy" | "error" | "null", ...args: any[]) => boolean;
    status:  Status;
    ready: (values: T[]) => this;
    busy: () => this;
    error: (err: Error) => this;
    isReady: boolean;
    isBusy: boolean;
    failed: boolean;

    private _data: T[];

    constructor(
        private httpService: HttpsRequest,
        private logger: Logger) { }

    get isLoaded() {
        return this._data || false;
    }

    loadSheet(id: string, range: string) {
        this.busy();
        this.logger.info(`Loading sheet ${id}...`);
        this.httpService.get({
            request: Sheets.request({sheet: [id, range]}),
            success: (data: {values: T[]}) => {
                this._data = data.values.slice(1);
                this.logger.info(`Sheet ${id} loaded!`);
                this.ready(this._data);
            },
            error: () => this.error(new Error('Sheet not found!'))
        });
        return this;
    }
    search(cb: (value: T) => boolean) {
        return this._data.filter(row => cb(row));
    }

    fetch(cb: (value: T) => boolean) {
        return this._data.find(row => cb(row));
    }
}
