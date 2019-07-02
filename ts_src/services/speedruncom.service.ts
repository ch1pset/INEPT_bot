import * as https from 'https';
import { IRequest } from './speedrun/interfaces';
import { createRequest } from './speedrun/util';
import { Game, Leaderboard } from './speedrun/resources';
import { WSStream } from '../utils/sstream';
import { NodeCallback, str } from '../utils/typedefs';
import { Singleton } from '../utils/decorators';

@Singleton()
export class SpeedrunCom {
    static self: SpeedrunCom;
    private GET(request: str | IRequest | URL, callback?: NodeCallback<Error, any>): WSStream
    {
        const wstream = new WSStream();
        https.get(request, response => {
            response.pipe(wstream)
            .once('finish', () => {
                const body = JSON.parse(wstream.data);
                if(response.statusCode === 200) {
                    callback(null, body.data);
                } else {
                    const e = new Error(body.message);
                    callback(e, null);
                }
            })
            .once('error', err => {
                console.error(err);
                callback(err, null)
            })
        });
        return wstream;
    }

    private getGame(abrv: str, embeds: str[], cb?: NodeCallback<Error, Game>)
    {
        const srcReq = createRequest(`/games?abbreviation=${abrv}&embed=${embeds.join(',')}`);
        const wstream = this.GET(srcReq, (err, games) => {
            if(!err) {
                cb(null, new Game(games[0]))
            } else {
                cb(err, null)
            }
        });
        return wstream;
    }

    public getLeader(abrv: str, cat: str, vars: str[][], lvl: str, cb?: NodeCallback<Error, any>)
    {
        return this.getGame(abrv, ['levels.variables', 'categories.variables'], (err, game) => {
            if(!err) {
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
                this.GET(request, (err, leader) => leader ? cb(null, leader) : cb(err, null));
            }
            else cb(err, null);
        })
    }
}