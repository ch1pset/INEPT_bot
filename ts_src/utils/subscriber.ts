import { Mixin } from './decorators';
import { str, Callback } from './typedefs';
import { SimpleEventEmitter } from './simple.events';

@Mixin([SimpleEventEmitter])
export class Subscriber implements SimpleEventEmitter {
    eventNames: () => (string | symbol)[];
    on: (event: string | symbol, listener: Callback<void>) => this;
    once: (event: string | symbol, listener: Callback<void>) => this;
    off: (event: string | symbol, listener: Callback<void>) => this;
    emit: (event: string | symbol, ...args: any[]) => boolean;
   
    get subscriptions() {
        return this.eventNames();
    }
    subscribe(event: str, cb: Callback<any>): Subscriber {
        return this.on(event, cb);
    }
    subscribeAll(events: any[][]) {
        events.forEach(([name, listener]: [string, (...args: any[]) => void]) => this.subscribe(name, listener));
    }
    dispatch(event: str, ...args: any[]): boolean {
        return this.emit(event, ...args);
    };
    unsubscribe(event: str, cb: Callback<any>): Subscriber {
        return this.off(event, cb);
    }
}