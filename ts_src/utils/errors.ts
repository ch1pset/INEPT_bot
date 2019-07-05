import { fn } from "./typedefs";

export class ResourceNotFoundError extends Error {
    constructor(rname: string) {
        super(`The resource ${rname} was not found.`);
    }
}

export class OutOfScopeError extends Error {
    constructor(target: fn, key: PropertyKey) {
        super(`The property ${String(key)} is out of the scope of ${target.name}.`);
    }
}
