import { URLSearchParams } from 'url';
import { IRequest } from "../../utils/rest";

export class SrRequest implements IRequest {
    hostname = "www.speedrun.com";
    path = '/api/v1';
    headers = {
        "Content-Type":"application/json",
        "User-Agent":"INEPT_bot/0.1.a",
    };
    method?: string;

    constructor(method: string, path: string, query: string) {
        this.path += path + query;
        this.method = method.toUpperCase();
    }

    setHeader(hname: string, value: string) {
        this.headers[hname] = value;
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
