import * as https from 'https';
import { OutgoingHttpHeaders } from 'http';
import { IRequest, Query } from "../../utils/rest";
import { StringStream } from '../../utils';

type RequestParams = {
    method?: string,
    path: string,
    query?: string,
    request?: SrRequest,
    headers?: OutgoingHttpHeaders,
};

export class SrRequest implements IRequest {
    hostname = "www.speedrun.com";
    path = '/api/v1';
    headers = {
        "Content-Type":"application/json",
        "User-Agent":"INEPT_bot/0.1.a",
    };
    method?: string;

    constructor({method, path, query}: RequestParams) {
        this.path += path + query;
        this.method = method.toUpperCase();
    }

    setHeaders(headers?: OutgoingHttpHeaders) {
        if(headers) 
            Object.assign(this.headers, headers);
        return this;
    }

    static game(abbr: string) {
        return new SrRequest({
            path: SRCAPI.ALL_GAMES, 
            query: Query.generate([
                ['abbreviation', abbr],
                ['embed', 'levels.variables,categories.variables'],
            ])});
    }

    static send({request, method, path, query, headers}: RequestParams) {
        const options = request ? 
            request.setHeaders(headers) 
            : new SrRequest({method, path, query});
        const sstream = new StringStream();
        sstream.busy();
        https.request(
            options,
            res => res.pipe(sstream)
                .once('finish', () => {
                    if(res.statusCode === 200) {
                        sstream.ready();
                    } else {
                        sstream.error(new Error(res.statusMessage));
                    }
                }))
        .end();
        return sstream;
    }
}

export enum SRCAPI {
    NOTIFY =     '/notifications',
    ALL_USERS =  '/users',
    ALL_GAMES =  '/games',
    ALL_RUNS =   '/runs',
    ALL_CATS =   '/categories',
    ALL_SERIES = '/series',
    USER =       '/users/:uid',
    RUN =        '/runs/:rid',
    VARIABLE =   '/variables/:vid',
    LEVEL =      '/levels/:lid',
    CATEGORY =   '/categories/:cid',
    GAME =       '/games/:gid',
    SERIES =     '/series/:sid',
    CAT_VARS =   '/categories/:cid/variables',
    LVL_VARS =   '/levels/:lid/variables',
    GAME_VARS =  '/games/:gid/variables',
    CAT_LEADER = '/leaderboards/:gid/category/:cid',
    LVL_LEADER = '/leaderboards/:gid/level/:lid/:cid',
}
