import { Links } from "./links.resource";
import { Variable } from "./variable.resource";

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

export interface Players {
    type:                   string;
    value:                  number;
}
