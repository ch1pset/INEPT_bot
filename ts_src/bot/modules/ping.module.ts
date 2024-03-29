import { BotModule } from "./base.module";
import { UserArgs } from "../../discord";
import { Message } from "discord.js";
import * as Service from '../../services';

export class Ping extends BotModule
{
    constructor(
        private msgService: Service.Responder,
        private logger: Service.Logger
        ) {
        super();
    }

    ping(args: UserArgs, msg: Message) {
        this.logger.info(msg.author.username);
        this.msgService.reply(msg, 'Pong!');
    }

    pingme(args: UserArgs, msg: Message) {
        this.msgService.directMessage(msg, 'Pong!');
    }

    pinguser(args: UserArgs, msg: Message) {
        this.msgService.directMessage(msg, `${msg.author.username} is pinging you!`, args.text[0]);
    }
}