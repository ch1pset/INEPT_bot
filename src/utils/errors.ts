export class ResourceNotFoundError extends Error {
    constructor(resource?: string) {
        super(`The resource ${resource ? resource + ' ': ''}was not found.`);
    }
}