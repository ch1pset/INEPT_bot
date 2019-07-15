export class Cloner {
    static clone(other: Cloner) {
        const obj = {};
        Object.assign(obj, other);
        return obj;
    }
}