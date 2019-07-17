import * as https from 'https';
import { IRequest } from '../utils/rest';
import { SrRequest, SRCAPI } from './speedrun/request';
import * as Resource from './speedrun/resources';
import { NodeCallback, str, StringStream, AsyncStatus, Mixin, Status, Callback, ResourceNotFoundError } from '../utils';
import { URLSearchParams } from 'url';
import { Logger } from './logger.service';

@Mixin([AsyncStatus])
export class SpeedrunCom implements AsyncStatus {
    on:     (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    once:   (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    off:    (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    emit:   (event: Status | "ready" | "busy" | "error" | "null", ...args: any[]) => boolean;
    status: Status;
    ready: () => Status;
    busy: () => Status;
    error: (err: Error) => Status;
    isReady: boolean;
    isBusy: boolean;
    failed: boolean;

    private _game: Resource.Game;
    constructor(private gid: string) {
        this.init();
    }

    private init() {
        this.busy();
        const query = new URLSearchParams([
            ['embeds','levels.variables,categories.variables']
        ]);
        const options = new SrRequest('GET', SRCAPI.GAME.setId('gid', this.gid), query);
        const sstream = new StringStream();
        https.request(
            options,
            res => res.pipe(sstream)
                .once('finish', () => {
                    if(res.statusCode === 200) {
                        this._game = sstream.obj.data;
                        this.ready();
                    } else {
                        this.error(new ResourceNotFoundError('Game'));
                    }
                })
                .once('error', (err) => {
                    this.error(err);
                }));
    }

    getCategory(name: string): Resource.Category {
        return this._game.categories.data.find(c => c.name === name);
    }

    getLevel(name: string): Resource.Level {
        return this._game.levels.data.find(lvl => lvl.name === name);
    }

    getLink(rel: string) {
        return this._game.links.find(link => link.rel === rel);
    }
}

const ylsrService = new SpeedrunCom('m1zz5210');
ylsrService.once('ready', () => {
    const sstream = new StringStream();
    https.get(
        ylsrService.getLink('leaderboard').uri,
        res => res.pipe(sstream));
})
