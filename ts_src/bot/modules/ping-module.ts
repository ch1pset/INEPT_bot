import { BotModule } from "./module";
import { UserArgs } from "../../user/arguments";
import { Message } from "discord.js";
import { IBotResponse, Response } from "../response";
import { EventEmitter } from "events";

export class PingModule extends BotModule
{
    constructor() {
        super();
    }

    public ping(args: UserArgs, msg: Message, send: any) {
        console.log(msg.author.username);
        send(msg, <IBotResponse>{
            TYPE: Response.REPLY,
            MSG: 'Pong!'
        });
    }

    public pingme(args: UserArgs, msg: Message, send: (msg: Message, res: IBotResponse) => void) {
        send(msg, <IBotResponse>{
            TYPE: Response.DM,
            MSG: 'Pong!'
        })
    }
}