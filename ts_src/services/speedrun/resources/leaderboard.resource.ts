import { Run, Links } from '.';

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
    runs:                   {place: number, run: Run}[];
    links:                  Links[];
}

