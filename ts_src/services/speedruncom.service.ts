import * as https from 'https';
import { IRequest } from './speedrun/interfaces';
import { SrRequest, SRCAPI } from './speedrun/request';
import { Game, Leaderboard } from './speedrun/resources';
import { WSStream } from '../utils/sstream';
import { NodeCallback, str } from '../utils/typedefs';
import { Singleton } from '../utils/decorators';
import { URLSearchParams } from 'url';

@Singleton()
export class SpeedrunCom {

    static self: SpeedrunCom;

    private sendRequest(options: IRequest, cb: NodeCallback<Error, any>) {
        const wstream = new WSStream();
        const req = https.request(
            options, 
            res => res.pipe(wstream)
                .on('finish', () => {
                if(res.statusCode === 200) {
                    cb(null, JSON.parse(wstream.data).data);
                } else {
                    cb(new Error(res.statusMessage), null);
                }})
                .on('error', e => cb(e, null)));
        req.end();
    }

    private getGame(abrv: str, embeds: str[], cb: NodeCallback<Error, Game>) {
        const query = new URLSearchParams();
        query.set('abbreviation', abrv);
        query.set('embed', embeds.join(','));
        this.sendRequest(
            SrRequest.create('GET', SRCAPI.ALL_GAMES.str() + '?' + query.toString()),
            (err, resource) => cb(err, new Game(resource[0])));
    }

    public getWR(abrv: str, cat: str, vars: str[][], lvl: str, cb: NodeCallback<Error, any>) {
        this.getGame(abrv, ['levels.variables', 'categories.variables'], (err, game) => {
            if(!err) {
                const category = game.getCategory(cat);
                const level = game.getLevel(lvl);
                const query = new URLSearchParams();
                if(vars) vars.forEach(v => {
                    let catvars = category.getVariableIDs(v[0], v[1]);
                    if(catvars) {
                        query.set(`var-${catvars[0]}`, catvars[1]);
                    }});
                query.set('top', '1');
                const path = level ? 
                    SRCAPI.LVL_LEADER.setIds(['gid', game.id], ['lid', level.id], ['cid', category.id]).str() 
                    : SRCAPI.CAT_LEADER.setIds(['gid', game.id], ['cid', category.id]).str();
                this.sendRequest(
                    SrRequest.create('GET', path + '?' + query.toString()),
                    (err, resource) => cb(err, resource.runs[0].run));
            }
            else cb(err, null)});
    }
}