
const _GLOBAL_EVENT_LISTENERS: {[event: string]: Function[]} = { };

export enum GlobalEvent {
    START = 'start',
    END = 'end'
}

export function Listen(event: string) {
    return function(target: Object, key: PropertyKey, descriptor: PropertyDescriptor) {
        const origin = descriptor.value;
        descriptor.value = function(callback: (...args: any[]) => any) {
            if(_GLOBAL_EVENT_LISTENERS[event]) _GLOBAL_EVENT_LISTENERS[event].push(callback);
            else _GLOBAL_EVENT_LISTENERS[event] = [callback];
            origin.apply(target, callback);
        }
        return descriptor;
    }
}

export function Fire(event: string) {
    return function(target: Object, key: PropertyKey, descriptor: PropertyDescriptor) {
        const origin = descriptor.value;
        descriptor.value = function(...args: any[]) {
            origin.apply(target, args);
            _GLOBAL_EVENT_LISTENERS[event].forEach(call => call(...args));
        }
        return descriptor;
    }
}