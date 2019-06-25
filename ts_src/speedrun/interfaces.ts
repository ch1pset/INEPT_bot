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
}

export interface ICategory {
    id:             string;
    name:           string;
    weblink:        string;
    rules:          string;
    variables?:     IVariable[];
}

export interface ILevel {
    id:             number;
    name:           string;
    weblink:        string;
    rules:          string;
    categories?:    ICategory[];
    variables?:     IVariable[];
}

export interface IGame {
    id:             number;
    abbreviation:   string;
    name:           string;
    weblink:        string;
    categories?:    ICategory[];
    variables?:     IVariable[];
    levels?:        ILevel[];
}