import { Client, Message, Channel, TextChannel } from 'discord.js';
import { UserArgs } from '../discord';
import { Subscribable, Mixin, Callback, str  } from '../utils';
import { Logger } from '../services';

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
        this.login(token)
            .then(resolved => Logger.default.debug(`Successfully logged in as ${this.user.username}!`))
            .catch(rejected => Logger.default.fatal(rejected));
    }

    private initialize() {
        this.on('message', (msg: Message) => {
            if(msg.content[0] === '!') {
                Logger.default.info(`User ${msg.author.username} sent: ${msg.content}`);
                let args = UserArgs.parse(msg.content);
                this.dispatch(args.cmd, args, msg);
            }
        });
    }
}