import { TryCatch } from "../../utils/decorators";
import { IGame, ILevel, ICategory, IVariable, IValue } from "./interfaces";


export class Variable implements IVariable {
    id: string;
    name: string;
    scope: string;
    values?: IValue[];

    constructor(v: any) {
        this.id = v ? v.id : null;
        this.name = v ? v.name: null;
        this.scope = v ? v.scope.type : null;
        this.values = v ? this.mapValueArray(v.values.values) : null;
    }

    private mapValueArray(values: any): IValue[] {
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

    getValue(label: string) {
        return this.values.find(v => v.label === label);
    }
}

export class Category implements ICategory {
    id: string;    
    name: string;
    weblink: string;
    rules: string;
    variables?: Variable[];

    constructor(c: any) {
        this.id = c ? c.id : null;
        this.name = c ? c.name : null;
        this.weblink = c ? c.weblink : null;
        this.rules = c ? c.rules : null;
        this.variables = c ? c.variables.data.map((v: any) => new Variable(v)) : null;
    }

    getVariableIDs(name: string, value: string) {
        let ret = this.variables.find(v => v.name === name);
        return ret ? [ret.id, ret.getValue(value).id] : null;
    }
}

export class Level implements ILevel {
    id: number;
    name: string;
    weblink: string;
    rules: string;
    categories: Category[];
    variables: Variable[];

    constructor(l: any) {
        this.id = l ? l.id : null;
        this.name = l ? l.name : null;
        this.weblink = l ? l.weblink : null;
        this.rules = l ? l.rules : null;
        this.categories = l.categories ? l.categories.data.map((c: any) => new Category(c)) : null;
        this.variables = l.variables ? l.variables.data.map((v: any) => new Variable(v)) : null;
    }

    getVariableIDs(name: string, value: string)
    {
        let ret = this.variables.find(v => v.name === name);
        return ret? [ret.id, ret.getValue(value).id] : null;
    }
}

export class Game implements IGame {
    id: number;
    abbreviation: string;
    name: string;
    weblink: string;
    categories?: Category[];
    variables?: Variable[];
    levels?: Level[];

    constructor(g: any) {
        this.id = g.id;
        this.abbreviation = g.abbreviation;
        this.name = g.names.international;
        this.weblink = g.weblink;
        this.categories = g.categories ? g.categories.data.map(c => new Category(c)) : null;
        this.variables = g.variables ? g.variables.data.map(v => new Variable(v)) : null;
        this.levels = g.levels ? g.levels.data.map(l => new Level(l)) : null;
    }

    getVariableIDs(name: string, value: string) {
        let ret = this.variables.find(v => v.name === name);
        return ret ? [ret.id, ret.getValue(value).id] : null;
    }

    getCategory(name: string) {
        return this.categories.find(c => c.name === name);
    }

    getLevel(name: string) {
        return this.levels.find(l => l.name === name);
    }
}

export class Leaderboard {
    
}