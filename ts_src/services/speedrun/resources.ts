export interface Leaderboard {
    weblink:                string;
    game:                   string;
    category:               string;
    level:                  string;
    platform:               string;
    region:                 string;
    emulators:              boolean;
    'video-only':           boolean;
    timing:                 string;
    values:                 {[id: string]: string};
    runs:                   {place: number, run: Run[]}[];
    links:                  Links[];
}

export interface Run {
    id:                     string;
    weblink:                string;
    game:                   string;
    level?:                 Level;
    category:               string;
    videos:                 {text?: string, links: Links[]}
    comment:                string;
    status:                 Status;
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

export interface Status {
    status:                 string;
    examiner:               string;
    'verify-date':          string;
}

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

export interface Category {
    id:                     string;
    name:                   string;
    weblink:                string;
    type:                   string;
    rules:                  string;
    players:                Players;
    miscellaneous:          boolean;
    links:                  Links[];

    variables?:             {data: Variable[]};
}

export interface Level {
    id:                     string;
    name:                   string;
    weblink:                string;
    rules:                  string;
    links:                  Links[];

    categories?:            {data: Category[]};
    variables?:             {data: Variable[]};
}

export interface Variable {
    id:                     string;
    name:                   string;
    category:               boolean;
    scope:                  {[prop: string]: string};
    mandatory:              boolean;
    'user-defined':         boolean;
    obsoletes:              boolean;
    values:                 {[id: string]: Value};
    'is-subcategory':       boolean;
    links:                  Links[];
}

export interface Value {
    label:                  string;
    rules:                  string;
    flags:                  {[name: string]: boolean};
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


export interface Players {
    type:                   string;
    value:                  number;
}

export interface Links {
    rel?:                    string;
    uri:                    string;
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