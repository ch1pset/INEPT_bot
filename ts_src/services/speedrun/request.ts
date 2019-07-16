import { URLSearchParams } from 'url';
import { IRequest } from "../../utils/rest";

export class SrRequest implements IRequest {
    hostname = "www.speedrun.com";
    path = '/api/v1';
    headers = {
        "Content-Type":"application/json",
        "User-Agent":"INEPT_bot/0.1.a"
    };
    method?: string;

    constructor(method: string, path: Route, query: URLSearchParams) {
        this.path += path.toString();
        this.path += query.toString();
        this.method = method.toUpperCase();
    }
}

export class Route {
    private path: string;
    constructor(path: string) {
        this.path = path;
    }
    toString() {
        return this.path;
    }
    setId(idType: string, idVal: string) {
        this.path = this.path.replace(':' + idType, idVal);
        return this;
    }
    setIds(...params: string[][]) {
        for(let [t, v] of params) {
            this.path = this.path.replace(':' + t, v);
        }
        return this;
    }
}

export const SRCAPI = {
    NOTIFY:     new Route('/notifications'),
    ALL_USERS:  new Route('/users'),
    ALL_GAMES:  new Route('/games'),
    ALL_RUNS:   new Route('/runs'),
    ALL_CATS:   new Route('/categories'),
    ALL_SERIES: new Route('/series'),
    USER:       new Route('/users/:uid'),
    RUN:        new Route('/runs/:rid'),
    VARIABLE:   new Route('/variables/:vid'),
    LEVEL:      new Route('/levels/:lid'),
    CATEGORY:   new Route('/categories/:cid'),
    GAME:       new Route('/games/:gid'),
    SERIES:     new Route('/series/:sid'),
    CAT_VARS:   new Route('/categories/:cid/variables'),
    LVL_VARS:   new Route('/levels/:lid/variables'),
    GAME_VARS:  new Route('/games/:gid/variables'),
    CAT_LEADER: new Route('/leaderboards/:gid/category/:cid'),
    LVL_LEADER: new Route('/leaderboards/:gid/level/:lid/:cid'),
}