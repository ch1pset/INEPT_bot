import { Client, Message, Channel, TextChannel, Snowflake, Collection, GuildChannel } from 'discord.js';
import { UserArgs } from '../discord';
import { Subscribable, Mixin, Callback, str, ChannelStream, Dictionary  } from '../utils';
import { Logger, Responder } from '../services';

@Mixin([Subscribable])
export class BotClient extends Client implements Subscribable
{
    _subscriptions: Dictionary<Callback<any>[]>;
    subscriptions: Dictionary<Callback<any>[]>;
    when: (event: str, cb: Callback<any>) => Subscribable;
    recall: (event: str, cb: Callback<any>) => Subscribable;
    dispatch: (event: str, ...args: any[]) => Subscribable;
    consume: (event: str, ...args: any[]) => Subscribable;

    private chLogger: Logger;
    constructor(
                token:      str,
        private msgService: Responder,
        private logger:     Logger
    ) {
        super();
        this.initialize();
        this.login(token)
            .then(resolved => {
                const logChannel = new ChannelStream(
                    <TextChannel>
                    this.guilds.find(g => g.name === 'Ch1pset')
                        .channels.find(c => c.name === 'botlog')
                    );
                this.chLogger = new Logger({ stdout: logChannel });
                
                this.chLogger.info(`Successfully logged in as ${this.user.username}!`);
                this.logger.debug(`Successfully logged in as ${this.user.username}!`);

                this.dispatch('login', this.chLogger);
            }).catch(rejected => {
                this.logger.fatal(rejected);
            });
    }

    private initialize() {
        this.on('message', (msg) => {
            if(msg.content[0] === '!') {
                this.logger.info(`User ${msg.author.username} sent: ${msg.content}`);
                this.chLogger.info(`User ${msg.author.username} sent: ${msg.content}`);
                let args = UserArgs.parse(msg.content);
                if(args.cmd === 'commands') {
                    this.msgService.reply(msg, `List of commands:\n${this.subscriptions.keys().map(k => '!' + k).join(', ')}`);
                } else {
                    this.dispatch(args.cmd, args, msg);
                }
            }
        });

        this.on('guildMemberAdd', (member) => {
            member.send(`Hello ${member.displayName}!\n\n` 
                + `I am ${this.user.username}, you can use \`!commands\` for a list of commands I can handle.\n`
                + `Welcome to the ${member.guild.name} server!`);

            const channel = this.getChannel('testing', member.guild.channels);
            if(channel) channel.send(`Welcome to the ${member.guild.name} server ${member}!`);

            this.chLogger.info(`New member joined the server!`)
        });

        this.on('warn', (info) => {
            this.logger.warn(info);
        });

        this.on('reconnecting', () => {
            this.logger.warn(`WS connection interrupted.`);
            this.logger.warn(`Reconnecting to Discord...`);
        });

        this.on('disconnect', (event) => {
            this.logger.fatal(event);
        });
    }

    private getChannel(channelName: str, channels: Collection<Snowflake, GuildChannel>): TextChannel {
        return <TextChannel>channels.find(ch => ch.name === channelName);
    }
}