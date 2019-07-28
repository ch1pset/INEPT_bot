import * as Srcom from './speedrun';
import { AsyncStatus, Mixin, Status, Callback, ResourceNotFoundError, createQuery, QueryParam } from '../utils';
import { Logger } from './logger.service';
import { SrRequest } from './speedrun.service';
import { HttpsRequest } from './http.service';

@Mixin([AsyncStatus])
export class SrGameManager implements AsyncStatus {
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

    private _game: Srcom.Resource.Game;

    constructor(abbr: string,
        private srcomService: SrRequest,
        private logger: Logger) {
        this.busy();
        this.srcomService.getGame({
            abbr,
            success: (game: Srcom.Resource.Game) => {
                this._game = game;
                this.ready();
                },
            error: (err) => this.error(err)
            });
    }

    get id() {
        return this._game.id;
    }

    private getCategory(name: string): Srcom.Resource.Category {
        return this._game.categories.data.find(c => c.name === name);
    }

    private getLevel(name: string): Srcom.Resource.Level {
        return this._game.levels.data.find(lvl => lvl.name === name);
    }

    private getVariable({category, level, varName, valName}: {category?: string, level?: string, varName: string, valName: string}): [string, string] {
        let variable: Srcom.Resource.Variable;

        if(category) {
            variable = this.getCategory(category)
                .variables.data.find(v => v.name === varName);
        } else if(level) {
            variable = this.getLevel(level)
                .variables.data.find(v => v.name === varName);
        } else {
            variable = this._game.variables.data.find(v => v.name === varName);
        }

        const values = variable.values.values;
        const valueId = Object.keys(values)
            .find(id => values[id].label === valName);

        return ['var-' + variable.id, valueId];
    }

    getLink(rel: string) {
        return this._game.links.find(link => link.rel === rel);
    }

    getLeaderboard(category: string, top: number, [varName, valName]: [string, string]) {
        srcomService.getCategoryLeader({
            lids: [ylsr.id, ylsr.getCategory(category).id],
            queryParams: [
                ['top', String(top)],
                ylsr.getVariable({ category, varName, valName })
            ],
            success: (leaderboard: Srcom.Resource.Leaderboard) => {
                console.log(leaderboard.runs);
            }
        });
    }
}

const srcomService = new SrRequest(HttpsRequest.default, Logger.default);
const ylsr = new SrGameManager('yl', srcomService, Logger.default);
ylsr.once('ready', () => {
    ylsr.getLeaderboard('Any%', 1, ['Platform Route', 'Console']);
});
