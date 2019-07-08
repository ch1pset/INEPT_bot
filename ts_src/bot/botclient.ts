import { Client, Message, Channel, TextChannel } from 'discord.js';
import { UserArgs } from '../discord';
import { Subscribable, Mixin, Callback, str  } from '../utils';
import { Logger, Responder } from '../services';

@Mixin([Subscribable])
export class BotClient extends Client implements Subscribable
{
    _subscriptions: Map<str, Callback<any>[]>;
    subscriptions: Map<str, Callback<any>[]>;
    when: (event: str, cb: Callback<any>) => Subscribable;
    recall: (event: str, cb: Callback<any>) => Subscribable;
    dispatch: (event: str, ...args: any[]) => Subscribable;
    consume: (event: str, ...args: any[]) => Subscribable;

    constructor(token: str,
        private msgService: Responder,
        private logger:     Logger
    ) {
        super();
        this.initialize();
        this.login(token)
            .then(resolved => {
                this.logger.debug(`Successfully logged in as ${this.user.username}!`);
            }).catch(rejected => {
                this.logger.fatal(rejected);
            });
    }

    private initialize() {
        this.on('message', (msg) => {
            if(msg.content[0] === '!') {
                this.logger.info(`User ${msg.author.username} sent: ${msg.content}`);
                let args = UserArgs.parse(msg.content);
                if(args.cmd === 'commands') {
                    this.msgService.reply(msg, `List of commands:\n${Object.keys(this.subscriptions).map(k => `!${k}`).join(', ')}`);
                } else {
                    this.dispatch(args.cmd, args, msg);
                }
            }
        });

        this.on('guildMemberAdd', (member) => {
            member.send(`Hello ${member.displayName}!\n\n` 
                + `I am ${this.user.username}, you can use \`!commands\` for a list of commands I can handle.\n`
                + `Welcome to the ${member.guild.name} server!`);

            const channel = <TextChannel>member.guild.channels.find(ch => ch.name === 'testing');
            channel.send(`Hello new member!`);
        });

        this.on('warn', (info) => {
            this.logger.warn(info);
        });

        this.on('reconnecting', () => {
            this.logger.warn(`WS connection interrupted.`);
            this.logger.info(`Reconnecting to Discord...`);
        });

        this.on('disconnect', (event) => {
            this.logger.fatal(event);
        });
    }
}