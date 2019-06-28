import * as EventEmitter from 'events';

export abstract class Subscriber {
    subscribe(emitter: EventEmitter, event: string): EventEmitter {
        return emitter.on(event, this[event]);
    }
    unsubscribe(emitter: EventEmitter, event: string): EventEmitter {
        return emitter.off(event, this[event]);
    }
}