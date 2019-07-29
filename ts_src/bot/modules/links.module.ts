import { Message } from 'discord.js';
import { UserArgs, ChannelData } from "../../discord";
import { DbManager, Responder, Logger } from '../../services';
import { UserData } from "../../discord";
import { str } from "../../utils/typedefs";
import { AccessRestrictions } from "../../discord";

export class Link {
    name: string;
    url: string;
    op: string;
    date: string;
    constructor(name: str, url: str, op: str, date: str) {
        this.name = name;
        this.url = url;
        this.op = op;
        this.date = date;
    }
    static clone(other: Link) {
        var copy: Link;
        if(other) copy = new Link(other.name, other.url, other.op, other.date);
        return copy;
    }
    static curDate() {
        return (new Date(Date.now())).toISOString().split('T')[0];
    }
    toString(): string {
        return `${this.name} ${this.url}\nPosted by ${this.op} on ${this.date}`;
    }
}

export const Links = (
    access:     AccessRestrictions,
    dbService:  DbManager<Link>,
    msgService: Responder,
    logger:     Logger) => {
    return {
        add: (args: UserArgs, msg: Message) => {
            const user = new UserData(msg.author, msg.member);
            const channel = new ChannelData(msg.channel, msg.guild);
            if(access.grant(user) && channel.isText) {
                if(args.list[0] && args.url) {
                    if(args.list[0].startsWith('_')) args.list[0] = args.list[0].substring(1);
                    const link = new Link(args.list[0], args.url, user.name, Link.curDate());
                    if(!dbService.has(link.name)) {
                        dbService.add(link.name, link);
                        msgService.reply(msg, `Link added! Use \`!getlink ${link.name}\` to call it.`);
                    } else if(
                        dbService.get(link.name).op === user.name 
                        && user.hasPermission(access.permissions)
                    ) {
                        dbService.add(link.name, link);
                        msgService.reply(msg, `Link overwritten!`);
                    } else {
                        msgService.reply(msg, `You can't overwrite another users link without `);
                    }
                } else  {
                    msgService.reply(msg, 'You must include a name(no spaces) and a valid URL beginning with `https://`');
                }
            } else {
                msgService.reply(msg, `You don't have access to this command in this channel!`);
            }
        },
        delete: (args: UserArgs, msg: Message) => {
            const user = new UserData(msg.author, msg.member);
            const channel = new ChannelData(msg.channel, msg.guild);
            if(access.grant(user) && channel.isText) {
                if(args.list[0]) {
                    if(dbService.has(args.list[0])) {
                        if(dbService.get(args.list[0]).op === user.name) {
                            dbService.delete(args.list[0]);
                            msgService.reply(msg, `Link has been deleted!`);
                        } else {
                            msgService.reply(msg, `Only the OP of a link can delete it.`);
                        }
                    } else {
                        msgService.reply(msg, `I could not find that link!`);
                    }
                } else {
                    msgService.reply(msg, `You need to include the name of the link you want to delete.`);
                }
            } else {
                msgService.reply(msg, `You don't have access to this command in this channel!`);
            }
        },
        get: (args: UserArgs, msg: Message) => {
            if(args.list[0]) {
                const link = Link.clone(dbService.get(args.list[0]));
                if(link) msgService.send(msg, link.toString());
                else msgService.reply(msg, `I couldn't find that link. Use \`!addlink [linkname] <url>\` to add a new one.`)
            } else msgService.reply(msg, `You must include the name of the link!`);
        }
    }
}
