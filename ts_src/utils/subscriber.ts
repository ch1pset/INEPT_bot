import { str, Callback, fn } from './typedefs';

function subscription(instance: Subscriber, method: fn) {
    return (...args: any[]) => method.apply(instance, args);
}

export class Subscriber {
    subscribe(target: Subscribable, event: string): Subscriber {
        target.when(event, subscription(this, this[event]));
        return this;
    }
    unsubscribe(target: Subscribable, event: string): Subscriber {
        target.recall(event, subscription(this, this[event]));
        return this;
    }
}

export class Subscribable {
    _subscriptions: Map<string, Callback<any>[]>;

    get subscriptions(): Map<string, Callback<any>[]> {
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
            if(this.subscriptions.get(event).length === 0)
                this.subscriptions.delete(event);
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