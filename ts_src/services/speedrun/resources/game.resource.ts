import { Links } from "./links.resource";
import { Category } from "./category.resource";
import { Variable } from "./variable.resource";
import { Level } from "./level.resource";

export interface Game {
    id:                     string;
    names:                  Names;
    abbreviation:           string;
    weblink:                string;
    release?:               number;
    'release-date':         string;
    rulset:                 Ruleset;
    romhack?:               boolean;
    gametypes:              string[];
    platforms:              string[];
    regions:                string[];
    genres:                 string[];
    engines:                string[];
    developers:             string[];
    publishers:             string[];
    moderators:             {[id: string]: string};
    created:                string;
    assets:                 Assets;
    links:                  Links[];

    categories?:            {data: Category[]};
    variables?:             {data: Variable[]};
    levels?:                {data: Level[]};
}

export interface Names {
    international:          string;
    japanese:               string;
    twitch:                 string;
}

export interface Ruleset {
    'show-milliseconds':    boolean;
    'require-verification': boolean;
    'require-video':        boolean;
    'run-times':            string[];
    'default-time':         string;
    'emulators-allowed':    boolean;
}

export interface Assets {
    logo:                   Asset;
    icon:                   Asset;
    'cover-tiny':           Asset;
    'cover-small':          Asset;
    'cover-medium':         Asset;
    'cover-large':          Asset;
    'trophy-1st':           Asset;
    'trophy-2nd':           Asset;
    'trophy-3rd':           Asset;
    'trophy-4th'?:          Asset;
    foreground?:            Asset;
    background?:            Asset;
}

export interface Asset {
    uri:                    string;
    width:                  number;
    height:                 number;
}
