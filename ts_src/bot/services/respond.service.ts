import { Message } from "discord.js";


export class RespondService {
    reply(message: Message, response: string) {
        message.reply(response);
    }
    send(message: Message, response: string) {
        message.channel.send(response);
    }
    directMessage(message: Message, response: string, user?: string) {
        if(!user)
            message.author.send(response);
        else {
            const member = message.guild ? message.guild.members.find(m => m.displayName === user) : null;
            if(member) member.send(response);
            else message.author.send('Sorry, I couldn\'t find that user.')
        }
    }
}