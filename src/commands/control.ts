import { UserArgs } from "../discord";
import { Message } from "discord.js";
import { BotClient } from "../bot/botclient";

export function Control(
    bot: BotClient
    ) {
    let isSleep = false;

    this.cmdlist = (args: UserArgs.Model, msg: Message) => {
        msg.reply('You can use these commands:\n' + bot.subscriptions.map(([name, cb]) => '!' + name).join(', '))
    }
    this.sleep = (args: UserArgs.Model, msg: Message) => {
        isSleep = !isSleep;
    }
    this.disable = (args: UserArgs.Model, msg: Message) => {
        let active = bot.subscriptions.some(([evt, cb]) => evt === args.list[0])
        if(active) {
            bot.unsubscribe(args.list[0]);
            msg.reply(`The !${args.list[0]} command has been disabled.`);
        }
    }
}
