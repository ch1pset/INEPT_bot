import { Client, Message, Channel, TextChannel, Snowflake, Collection, GuildChannel } from 'discord.js';
import { UserArgs } from '../discord';
import { Logger, Responder } from '../services';
import { Mixin } from '../utils/decorators';
import { Subscriber } from '../utils/events';
import { str, Callback } from '../utils/typedefs';
import { ChannelStream } from '../utils/streams';

@Mixin([Subscriber])
export class BotClient extends Client implements Subscriber
{
    subscriptions: string[];
    subscribe: (event: str, cb: Callback<any>) => Subscriber;
    subscribeAll: (events: any[][]) => void;
    unsubscribe: (event: str, cb: Callback<any>) => Subscriber;
    dispatch: (event: str, ...args: any[]) => boolean;

    constructor(token:      str,
        private msgService: Responder,
        private logger:     Logger
    ) {
        super();
        this.initialize();
        this.login(token)
            .then(resolved => {
                this.logger.debug(`Successfully logged in as ${this.user.username}!`);
                this.dispatch('login');
            }).catch(rejected => {
                this.logger.fatal(rejected);
            });
    }

    private initialize() {
        this.on('message', (msg) => {
            if(msg.content[0] === '!') {
                this.logger.info(`User ${msg.author.username} sent: ${msg.content}`);
                let args = UserArgs.parse(msg.content);
                this.dispatch(args.cmd, args, msg);
            }
        });

        this.on('guildMemberAdd', (member) => {
            member.send(`Hello ${member}!\n\n` 
                + `I am ${this.user.username}, you can use \`!commands\` for a list of commands I can handle.\n`
                + `Welcome to the ${member.guild.name} server!`);

            const channel = this.getChannel('testing', member.guild.channels);
            if(channel) channel.send(`Welcome to the ${member.guild.name} server ${member}!`);

            this.logger.info(`New member joined the server!`)
        });

        this.on('warn', (info) => {
            this.logger.warn(info);
        });

        this.on('error', (err) => {
            this.logger.eror(err);
        });

        this.on('reconnecting', () => {
            this.logger.warn(`WS connection interrupted.`);
            this.logger.warn(`Reconnected to Discord.`);
        });

        this.on('disconnect', (event) => {
            this.logger.fatal(event);
        });
    }

    private getChannel(channelName: str, channels: Collection<Snowflake, GuildChannel>): TextChannel {
        return <TextChannel>channels.find(ch => ch.name === channelName);
    }
}