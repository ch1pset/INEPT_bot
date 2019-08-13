import { UserArgs } from "../../discord";
import { Message } from "discord.js";
import * as Service from '../../services';

export function Ping(
    msgService: Service.Responder,
    logger: Service.Logger) {

    this.ping = function(args: UserArgs.Model, msg: Message) {
        msgService.reply(msg, 'Pong!');
    }
    this.pingme = function(args: UserArgs.Model, msg: Message) {
        msgService.directMessage(msg, 'Pong!');
    }
    this.pinguser = function(args: UserArgs.Model, msg: Message) {
        logger.info(`${msg.author.username} is pinging ${args.list[0]}`)
        msgService.directMessage(msg, `${msg.author.username} is pinging you!`, args.list[0]);
    }
}