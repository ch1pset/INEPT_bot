import { BotModule } from "./base.module";
import { UserArgs } from "../../user/arguments";
import { Message } from "discord.js";
import { RespondService } from "../services/respond.service";
import { TryCatch } from "../../utils/decorators";

export class PingModule extends BotModule
{
    constructor(private msgService: RespondService) {
        super();
    }

    ping(args: UserArgs, msg: Message, send: any) {
        console.log(msg.author.username);
        this.msgService.reply(msg, 'Pong!');
    }

    pingme(args: UserArgs, msg: Message) {
        this.msgService.directMessage(msg, 'Pong!');
    }

    pinguser(args: UserArgs, msg: Message) {
        this.msgService.directMessage(msg, `${msg.author.username} is pinging you!`, args.text[0]);
    }
}