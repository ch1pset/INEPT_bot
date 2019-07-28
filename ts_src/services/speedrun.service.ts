import { createQuery, ResourceNotFoundError } from "../utils";
import { Logger } from "./logger.service";
import { HttpsRequest, HttpsRequestParams } from "./http.service";
import * as Srcom from './speedrun';


export class SrRequest {

    constructor(
        private httpService: HttpsRequest,
        private logger: Logger) { }

    getGame({abbr, success, error}: HttpsRequestParams) {
        this.httpService.get({
            request: Srcom.request({
                path: Srcom.api.GAMES,
                query: createQuery([
                    ['abbreviation', abbr],
                    ['embed', 'levels.variables,categories.variables']
                ])}),
            success: (obj: any) => success(obj.data[0]),
            error: (err: Error) => error(new ResourceNotFoundError('Game'))
        });
    }

    getCategoryLeader({lids, queryParams, success, error}: HttpsRequestParams) {
        const [gid, cid] = lids;
        this.httpService.get({
            request: Srcom.request({
                path: Srcom.api.LEADERBOARD_C
                    .replace(/:gid/, gid)
                    .replace(/:cid/, cid),
                query: createQuery(queryParams)
            }),
            success: (obj: any) => success(obj.data),
            error: (err: Error) => error(new ResourceNotFoundError('Leaderboard'))
        });
    }
}