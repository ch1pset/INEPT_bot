import { IRequest } from "../../utils/rest";

export type SrRequestParams = {path: string, method?: string, query?: string};

export function request({path, method, query}: SrRequestParams): IRequest { 
    return {
        hostname: 'www.speedrun.com',
        path: '/api/v1' + path + (query ? query : ''),
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'INEPT_bot/0.1.0'
        },
        method,
        body: {}
    }
}
