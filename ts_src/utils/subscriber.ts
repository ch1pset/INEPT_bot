import { str, Callback, fn } from './typedefs';

export class Subscriber {
    subscribe(target: Subscribable, event: string): Subscribable {
        return target.when(event, (...args: any[]) => this[event].apply(this, args));
    }
    unsubscribe(target: Subscribable, event: string): Subscribable {
        return target.recall(event, (...args: any[]) => this[event].apply(this, args));
    }
}

export class Subscribable {
    _subscriptions: Map<string, Callback<any>[]>;

    get subscriptions() {
        if(!this._subscriptions)
            this._subscriptions = new Map<string, Callback<any>[]>();
        return this._subscriptions;
    }
    when(event: str, cb: Callback<any>): Subscribable {
        if(this.subscriptions.has(event)) {
            this.subscriptions.get(event).push(cb);
        } else {
            this.subscriptions.set(event, [cb]);
        }
        return this;
    }
    recall(event: str, cb: Callback<any>): Subscribable {
        if(this.subscriptions.has(event)) {
            const i = this.subscriptions.get(event).findIndex(cb);
            if(i !== -1) this.subscriptions.get(event).slice(i, 1);
        }
        return this;
    }
    dispatch(event: str, ...args: any[]): Subscribable {
        if(this.subscriptions.has(event)) {
            this.subscriptions.get(event).forEach(cb => cb(...args))
        }
        return this;
    }
    consume(event: str, ...args: any[]): Subscribable {
        if(this.subscriptions.has(event)) {
            this.subscriptions.get(event).pop()(...args);
            if(this.subscriptions.get(event).length === 0)
                this.subscriptions.delete(event);
        }
        return this;
    }
}