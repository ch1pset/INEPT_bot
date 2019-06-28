import * as https from 'https';
import { IRequest } from './interfaces';
import { createRequest } from './util';
import { Game } from './resources';
import { WSStream } from '../utils/sstream';
import { Promisify, TryCatch } from '../utils/decorators';
import { NodeCallback } from '../utils/typedefs';

export class SpeedrunComService {
    private static readonly _self = new SpeedrunComService();
    private constructor() { }
    static get self() { return SpeedrunComService._self; }

    @Promisify
    private GET(request: string | IRequest | URL, callback?: NodeCallback): WSStream
    {
        const wstream = new WSStream();
        https.get(request, response => response.pipe(wstream));
        wstream.on('finish', () => callback(undefined, wstream));
        wstream.on('error', err => callback(err, undefined));
        return wstream;
    }

    private async getGame(abrv, embeds)
    {
        const srcReq = createRequest(`/games?abbreviation=${abrv}&embed=${embeds.join(',')}`);
        const games = await this.GET(srcReq)
            .then((sstream: WSStream) => JSON.parse(sstream.data).data)
            .catch(() => null);
        if(games)
            return new Game(games[0]);
        return null;
    }

    public async getLeader(abrv: string, cat: string, vars: string[][], lvl: string)
    {
        let game = await this.getGame(abrv, ['levels.variables', 'categories.variables']);
        if(game) {
            const category = game.getCategory(cat);
            const level = game.getLevel(lvl);
            let query = "";
        
            if(vars) vars.forEach(v => {
                let catvars = category.getVariableIDs(v[0], v[1]);
                if(catvars) {
                    query += `var-${catvars[0]}=${catvars[1]}&`;
                }
            });
            const request = createRequest(`/leaderboards/${game.id}${level? `/level/${level.id}/` : `/category/`}${category.id}?${query}`);
            return this.GET(request)
                .then(sstream => JSON.parse(sstream.data).data)
                .catch(() => null);
        }
        return null;
    }
}