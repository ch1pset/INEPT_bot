import { IRequest, IValue } from "./interfaces";

export function createRequest(path: string, method?: string): IRequest
{
    return {
        hostname: "www.speedrun.com",
        path: `/api/v1${path? path : ''}`,
        headers: {
            "Content-Type":"application/json",
            "User-Agent":"INEPT_bot/0.1.a"
        },
        method
    }
}

export function mapValueArray(values: any): IValue[] {
    const ret: IValue[] = [];
    for(let id in values) {
        ret.push({
            id: id,
            label: values[id].label,
            rules: values[id].rules
        });
    }
    return ret;
}