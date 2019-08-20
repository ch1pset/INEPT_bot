import { str, Callback, Subscription } from '../typedefs';

export class Subscriber {
    subscriptions: Subscription[] = [];
    subscribe(event: str, cb: Callback<any>): Subscriber {
        this.subscriptions.push([event, cb]);
        return this;
    }
    subscribeAll(events: any[][]) {
        events.forEach(([name, listener]: [string, (...args: any[]) => void]) => this.subscribe(name, listener));
    }
    dispatch(event: str, ...args: any[]): boolean {
        let called = false;
        this.subscriptions.forEach(([evt, listen]) => {
            if(evt === event) {
                listen(...args);
                called = true;
            }
        });
        return called;
    }
    unsubscribe(event: str): Subscriber {
        let indx = this.subscriptions.findIndex(([evt, listen]) => evt === event);
        if(indx !== -1)
            this.subscriptions.splice(indx, 1);
        return this;
    }
}