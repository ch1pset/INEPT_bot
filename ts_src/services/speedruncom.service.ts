import * as https from 'https';
import { SrRequest, SRCAPI } from './speedrun/request';
import * as Resource from './speedrun';
import { StringStream, AsyncStatus, Mixin, Status, Callback, ResourceNotFoundError, Query } from '../utils';
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
    constructor(
        private abbreviation: string,
        private logger: Logger) {
        console.log('Initializing SrCom Service...');
        this.init();
    }

    private init() {
        this.busy();
        const sstream = new StringStream();
        const req = https.request(
            new SrRequest('GET', 
                SRCAPI.ALL_GAMES, 
                Query.generate([
                    ['abbreviation', this.abbreviation],
                    ['embed','levels.variables,categories.variables'],
                ])),
            res => res.pipe(sstream)
                .once('finish', () => {
                    this._game = sstream.obj.data[0];
                    if(res.statusCode === 200 && this._game)
                        this.ready();
                        
                    else this.error(new ResourceNotFoundError('Game'));
                })
                .once('error', (err) => {
                    this.error(err);
                }));
        req.end();
    }

    get id() {
        return this._game.id;
    }

    getCategory(name: string): Resource.Category {
        return this._game.categories.data.find(c => c.name === name);
    }

    getLevel(name: string): Resource.Level {
        return this._game.levels.data.find(lvl => lvl.name === name);
    }

    getCatVariable(category: string, name: string, valName: string): [string, string] {
        const variable = this.getCategory(category)
            .variables.data.find(variable => variable.name === name);
        const value = Object.keys(variable.values.values)
            .find(id => variable.values.values[id].label === valName);
        return [variable.id, value];
    }

    getLevelVariable(level: string, name: string, valName: string): [string, string] {
        const variable = this.getLevel(level)
            .variables.data.find(variable => variable.name === name);
        const value = Object.keys(variable.values.values)
            .find(id => variable.values.values[id].label === valName);
        return [variable.id, value];
    }

    getLink(rel: string) {
        return this._game.links.find(link => link.rel === rel);
    }
}

const ylsrService = new SpeedrunCom('yl', Logger.default);
ylsrService.once('ready', () => {
    const category = ylsrService.getCategory('Any%').id;
    const [variable, value] = ylsrService.getCatVariable('Any%', 'Platform Route', 'Console');

    const path = SRCAPI.CAT_LEADER
        .replace(/:gid/, ylsrService.id)
        .replace(/:cid/, category);
        
    const sstream = new StringStream();
    const req = https.request(
        new SrRequest(
            'GET',
            path,
            Query.generate([
                ['top', '1'],
                [`var-${variable}`, value]
            ])),
        res => res.pipe(sstream));
    req.end();


    sstream.once('finish', () => {
        const leaderboard: Resource.Leaderboard = sstream.obj.data;
        console.log(leaderboard.runs);
    });
})
