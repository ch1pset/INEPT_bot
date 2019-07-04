import { RequestOptions, OutgoingHttpHeaders } from "http";

export interface IRequest extends RequestOptions {
    hostname:       string;
    path:           string;
    headers:        OutgoingHttpHeaders;
    method?:        string;
}

export interface IValue {
    id:             string;
    label:          string;
    rules:          string;
}

export interface IVariable {
    id:             string;
    name:           string;
    scope:          string;
    values?:        IValue[];

    getValue(label: string): IValue;
}

export interface ICategory {
    id:             string;
    name:           string;
    weblink:        string;
    rules:          string;
    variables?:     IVariable[];

    getVariableIDs(name: string, value: string):    string[];
}

export interface ILevel {
    id:             string;
    name:           string;
    weblink:        string;
    rules:          string;
    categories?:    ICategory[];
    variables?:     IVariable[];

    getVariableIDs(name: string, value: string):    string[];
}

export interface IGame {
    id:             string;
    abbreviation:   string;
    name:           string;
    weblink:        string;
    categories?:    ICategory[];
    variables?:     IVariable[];
    levels?:        ILevel[];

    getVariableIDs(name: string, value: string):    string[];
    getCategory(name: string):                      ICategory;
    getLevel(name: string):                         ILevel;
}