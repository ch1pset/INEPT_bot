import { Links } from "./links.resource";

export interface Variable {
    id:                     string;
    name:                   string;
    category:               boolean;
    scope:                  {[prop: string]: string};
    mandatory:              boolean;
    'user-defined':         boolean;
    obsoletes:              boolean;
    values:                 {values: {[id: string]: Value}, default: string, choices: {[id: string]: string}, _note: string};
    'is-subcategory':       boolean;
    links:                  Links[];
}

export interface Value {
    label:                  string;
    rules:                  string;
    flags:                  {[name: string]: boolean};
}
