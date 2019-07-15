import { fn } from "./typedefs";

export class ResourceNotFoundError extends Error {
    constructor(rname: string) {
        super(`The resource ${rname} was not found.`);
    }
}
