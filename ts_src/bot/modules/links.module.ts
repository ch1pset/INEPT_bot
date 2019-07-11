import { BotModule } from "./base.module";
import { Permissions, Message } from 'discord.js';
import { UserArgs, ChannelData } from "../../discord";
import { DbManager, Responder, Logger } from '../../services';
import { ILink } from "./link";
import { UserData } from "../../discord";
import { str } from "../../utils";
const PERMISSION = Permissions.FLAGS;

export class Links extends BotModule {

    constructor(
        private dbService:  DbManager<ILink>,
        private msgService: Responder,
        private logger:     Logger
    ) {
        super();
    }

    private get date() {
        return (new Date(Date.now())).toISOString().split('T')[0];
    }

    private format(link: ILink): string {
        return `${link.name} ${link.url} \nPosted by ${link.op} on ${link.date}`;
    }

    private createLink(name: str, url: str, op: str, date: str): ILink {
        return { name, url, op, date };
    }

    addlink(args: UserArgs, msg: Message) {
        const user = new UserData(msg.author, msg.member);
        const channel = new ChannelData(msg.channel, msg.guild);
        if(this.grantAccess(user) && channel.isText) {
            if(args.list[0] && args.url) {
                const link = this.createLink(args.list[0], args.url, user.name, this.date);
                if(!this.dbService.has(link.name)) {
                    this.dbService.add(link.name, link);
                    this.msgService.reply(msg, `Link added! Use \`!getlink ${link.name}\` to call it.`);
                } else if(
                    this.dbService.get(link.name).op === user.name 
                    && user.hasPermission(this.permissions)
                ) {
                    this.dbService.add(link.name, link);
                    this.msgService.reply(msg, `Link overwritten!`);
                } else {
                    this.msgService.reply(msg, `You can't overwrite another users link without `)
                }
            } else  {
                this.msgService.reply(msg, 'You must include a name(no spaces) and a valid URL beginning with `https://`');
            }
        } else {
            this.msgService.reply(msg, `You don't have access to this command in this channel!`);
        }
    }

    getlink(args: UserArgs, msg: Message) {
        const link = this.dbService.get(args.list[0]);
        if(link) this.msgService.send(msg, this.format(link));
        else this.msgService.reply(msg, `I couldn't find that link. Use \`!addlink <url> [linkname]\` to add a new one.`)
    }
}