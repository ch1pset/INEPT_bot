import { Links } from "./links.resource";

export interface Run {
    id:                     string;
    weblink:                string;
    game:                   string;
    level?:                 string;
    category:               string;
    videos:                 {text?: string, links: Links[]}
    comment:                string;
    status:                 RunStatus;
    players:                Player[];
    date:                   string;
    submitted:              string;
    times:                  Times;
    system:                 System;
    splits:                 Links;
    values:                 {[id: string]: string};
    links:                  Links[];
}

export interface System {
    platform:               string;
    emulated:               boolean;
    region:                 string;
}

export interface Times {
    primary:                string;
    primary_t:              number;
    realtime:               string;
    realtime_t:             number;
    realtime_noloads:       string;
    realtime_noloads_t:     number;
    ingame:                 string;
    ingame_t:               number;
}

export interface Player {
    rel:                    string;
    id:                     string;
    uri:                    string;
}

export interface RunStatus {
    status:                 string;
    examiner:               string;
    'verify-date':          string;
}

export interface VerifyStatus {
    status: {
        status:             string;
        reason:             string;
    }
}
