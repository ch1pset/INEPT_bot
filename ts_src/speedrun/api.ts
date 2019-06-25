import * as https from 'https';
import { IRequest } from './interfaces';
import { createRequest } from './util';
// import { TryCatch, Promisify } from '../utils/decorators';
import { Game } from './resources';
import { WSStream } from '../utils/sstream';

function GET(request: string | IRequest | URL, callback: (err: Error, data: string) => void): WSStream
{
    const wstream = new WSStream();
    https.get(request, response => response.pipe(wstream));
    wstream.on('finish', () => callback(undefined, wstream.data));
    wstream.on('error', err => callback(err, undefined));
    return wstream;
}

function getGame(abrv, embeds)
{
    const srcReq = createRequest(`/games?abbreviation=${abrv}&embed=${embeds.join(',')}`);
    return GET(srcReq).then(games => new Game(games[0]));
}

function getUser(name)
{
    const srcReq = createRequest(`/users?lookup=${name}`);
    return GET(srcReq).then(users => users[0]);
}

export async function getLeader(abrv: string, cat: string, vars: string[][], lvl: string)
{
    let game = await getGame(abrv, ['levels.variables', 'categories.variables']);
    let category = game.getCategory(cat);
    let level = game.getLevel(lvl);
    let query = "";

    if(vars) vars.forEach(v => {
        let catvars = category.getVariableIDs(v[0], v[1]);
        if(catvars) {
            query += `var-${catvars[0]}=${catvars[1]}&`;
        }
        // let lvlvars = level.getVariableIDs(v[0], v[1]);
        // if(lvlvars) {
        //     query += `var-${lvlvars[0]}=${lvlvars[1]}&`;
        // }
    });
    return GET(createRequest(`/leaderboards/${game.id}${level? `/level/${level.id}/` : `/category/`}${category.id}?${query}`));
}