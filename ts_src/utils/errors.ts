import { fn } from "./typedefs";

export class ResourceNotFoundError extends Error {
    constructor(rname: string) {
        super(`The resource ${rname} was not found.`);
    }
}

export class SingletonInstantiationError extends Error {
    constructor(ctor: fn) {
        super(`At 'new ${ctor.name}()' Cannot instantiate Singletons! You can only call singleton instances with the '.self' static property!`)
    }
}