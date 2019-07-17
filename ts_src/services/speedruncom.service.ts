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

    // private sendRequest(options: IRequest, cb: NodeCallback<Error, any>) {
    //     const sstream = new StringStream();
    //     const req = https.request(
    //         options, 
    //         res => res.pipe(sstream)
    //             .on('finish', () => {
    //             if(res.statusCode === 200) {
    //                 cb(null, sstream.obj.data);
    //             } else {
    //                 cb(new Error(res.statusMessage), null);
    //             }})
    //             .on('error', e => cb(e, null)));
    //     req.end();
    // }

    // private getGame(abrv: str, embeds: str[], cb: NodeCallback<Error, Game>) {
    //     const query = new URLSearchParams();
    //     query.set('abbreviation', abrv);
    //     query.set('embed', embeds.join(','));
    //     this.sendRequest(
    //         new SrRequest('GET', SRCAPI.ALL_GAMES.str() + '?' + query.toString()),
    //         (err, resource) => cb(err, new Game(resource[0])));
    // }

    // public getWR(abrv: str, cat: str, vars: str[][], lvl: str, cb: NodeCallback<Error, any>) {
    //     this.getGame(abrv, ['levels.variables', 'categories.variables'], (err, game) => {
    //         if(!err) {
    //             const category = game.getCategory(cat);
    //             const level = game.getLevel(lvl);
    //             const query = new URLSearchParams();
    //             if(vars) vars.forEach(v => {
    //                 let catvars = category.getVariableIDs(v[0], v[1]);
    //                 if(catvars) {
    //                     query.set(`var-${catvars[0]}`, catvars[1]);
    //                 }});
    //             query.set('top', '1');
    //             const path = level ? 
    //                 SRCAPI.LVL_LEADER.setIds(['gid', game.id], ['lid', level.id], ['cid', category.id]).str() 
    //                 : SRCAPI.CAT_LEADER.setIds(['gid', game.id], ['cid', category.id]).str();
    //             this.sendRequest(
    //                 new SrRequest('GET', path + '?' + query.toString()),
    //                 (err, resource) => cb(err, resource.runs[0].run));
    //         }
    //         else cb(err, null)});
    // }
}
