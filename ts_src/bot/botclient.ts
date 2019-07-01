import { Client, Message } from 'discord.js';
import * as Args from '../user/arguments';
import { Subscribable } from '../utils/subscriber';
import { Callback, str } from '../utils/typedefs';
import { Mixin } from '../utils/decorators';

@Mixin([Subscribable])
export class BotClient extends Client implements Subscribable
{
    _subscriptions: Map<str, Callback<any>[]>;
    subscriptions: Map<str, Callback<any>[]>;
    when: (event: str, cb: Callback<any>) => Subscribable;
    recall: (event: str, cb: Callback<any>) => Subscribable;
    dispatch: (event: str, ...args: any[]) => Subscribable;
    consume: (event: str, ...args: any[]) => Subscribable;

    constructor(token: str) {
        super();
        this.initialize();
        this.login(token);
    }

    private initialize() {
        this.on('message', (msg: Message) => {
            if(msg.content[0] === '!') {
                console.log(`User ${msg.author.username} sent: ${msg.content}`);
                let args = Args.parse(msg.content);
                this.dispatch(args.cmd, args, msg);
            }
        });
    }
}