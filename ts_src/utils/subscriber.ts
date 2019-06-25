import * as EventEmitter from 'events';

export interface Subscriber {
    subscribe(emitter: EventEmitter, event: string): EventEmitter;
    unsubscribe(emitter: EventEmitter, event: string): EventEmitter;
}