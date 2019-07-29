import { Mixin } from '../utils/decorators';
import { Logger, HttpsRequest, Srcom } from '.';
import { AsyncStatus, Status } from '../utils/asyncstat';
import { Callback } from '../utils/typedefs';
import { createQuery } from '../utils/rest';


@Mixin([AsyncStatus])
export class SrGameManager implements AsyncStatus {
    on:     (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    once:   (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    off:    (event: Status | "ready" | "busy" | "error" | "null", listener: Callback<void>) => this;
    emit:   (event: Status | "ready" | "busy" | "error" | "null", ...args: any[]) => boolean;
    status: Status;
    ready: (...args: any[]) => Status;
    busy: () => Status;
    error: (err: Error) => Status;
    isReady: boolean;
    isBusy: boolean;
    failed: boolean;

    private _game: Srcom.Resource.Game;

    constructor(abbr: string,
        private httpService: HttpsRequest,
        private logger: Logger) {
        this.getGame(abbr);
    }

    private getGame(abbr: string) {
        this.busy();
        this.logger.info(`Loading ${abbr}...`);
        this.httpService.get({
            request: Srcom.request({
                path: Srcom.api.GAMES,
                query: createQuery([
                    ['abbreviation', abbr],
                    ['embed', 'categories.variables,levels.veriables,variables']
                ])
            }),
            success: (games: {data: Srcom.Resource.Game[]}) => {
                this.logger.info(`Successfully loaded ${abbr}.`);
                this._game = games.data[0];
                this.ready();
            },
            error: (err) => this.error(err)
        });
    }

    public getLeaderboard({category, level, top, platform}: {
        category?: string,
        level?: string,
        top: number,
        platform?: string
    }) {
        this.busy();
        const query = createQuery([
            ['top', String(top)],
            this.getVariable({ category, level,
                varName: 'Platform Route',
                valName: platform ? platform : 'PC'
            })]);
        this.httpService.get({
            url: this.getLink({category, rel: 'leaderboard'}) + query,
            success: (leaderboard: {data: Srcom.Resource.Leaderboard}) => {
                this.ready(leaderboard.data);
            },
            error: err => this.error(err)
        });
        return this;
    }

    private getLink({category, level, rel}: {
        category?: string,
        level?: string,
        rel: string
    }) {
        if(category) {
            return this.getCategory(category)
                .links.find(link => link.rel === rel).uri;
        }
        if(level) {
            return this.getLevel(level)
                .links.find(link => link.rel === rel).uri;
        }
        return this._game.links.find(link => link.rel === rel).uri;
    }

    private getVariable({category, level, varName, valName}: {
        category?: string,
        level?: string,
        varName: string,
        valName: string
    }): [string, string] {
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

    private getCategory(name: string): Srcom.Resource.Category {
        return this._game.categories.data.find(c => c.name === name);
    }

    private getLevel(name: string): Srcom.Resource.Level {
        return this._game.levels.data.find(lvl => lvl.name === name);
    }
}
