import { UserArgs } from "../../discord";
import { Message } from "discord.js";
import * as Service from '../../services';

export const Ping = (
    msgService: Service.Responder,
    logger: Service.Logger) => {
    return {
        ping: (args: UserArgs, msg: Message) => {
            msgService.reply(msg, 'Pong!');
        },
        pingme: (args: UserArgs, msg: Message) => {
            msgService.directMessage(msg, 'Pong!');
        },
        pinguser: (args: UserArgs, msg: Message) => {
            msgService.directMessage(msg, `${msg.author.username} is pinging you!`, args.text[0]);
        }
    }
}