import { Client, Message } from 'discord.js';
import { IBotResponse, Response } from './response';
import * as Args from '../user/arguments';

export class BotClient extends Client
{
    constructor(token: string) {
        super();
        this.initialize();
        this.login(token);
    }

    public send(msg: Message, res: IBotResponse): void {
        switch(res.TYPE) {
            case Response.REPLY:
                msg.reply(res.MSG);
                break;
            case Response.CHANNEL:
                msg.channel.send(res.MSG);
                break;
            case Response.DM:
                msg.author.send(res.MSG);
                break;
        }
    }

    private initialize() {
        this.on('message', (msg: Message) => {
            if(msg.content[0] === '!') {
                console.log(`User ${msg.author.username} sent: ${msg.content}`);
                let args = Args.parseArgs(msg.content);
                this.emit(args.cmd, args, msg, this.send);
            }
        });
    }

}