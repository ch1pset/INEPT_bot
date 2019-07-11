import { Message } from "discord.js";
import { Singleton } from "../utils/decorators";

@Singleton()
export class Responder {

    static self: Responder;

    reply = (message: Message | any, response: string) => message.reply(response);

    send = (message: Message | any, response: string) => message.channel.send(response);

    directMessage(message: Message | any, response: string, user?: string) {
        if(!user)
            message.author.send(response);
        else {
            const member = message.guild ? message.guild.members.find(m => m.displayName === user) : null;
            if(member) member.send(response);
            else message.author.send('Sorry, I couldn\'t find that user.')
        }
    }
}