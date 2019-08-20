import { str } from "../typedefs";

export class Link {
    name: string;
    url: string;
    op: string;
    date: string;
    constructor(name: str, url: str, op: str, date: str) {
        this.name = name;
        this.url = url;
        this.op = op;
        this.date = date;
    }
    static clone(other: Link) {
        var copy: Link;
        if(other) copy = new Link(other.name, other.url, other.op, other.date);
        return copy;
    }
    static curDate() {
        return (new Date(Date.now())).toISOString().split('T')[0];
    }
    toString(): string {
        return `${this.name} ${this.url}\nPosted by ${this.op} on ${this.date}`;
    }
}