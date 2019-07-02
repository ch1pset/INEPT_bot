import { IRequest } from "./interfaces";
import { OutgoingHttpHeaders } from "http";

export class Request implements IRequest {
    hostname: string;
    path: string;
    headers: OutgoingHttpHeaders;
    method?: string;
    static create(path: string, method?: string): IRequest {
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
}