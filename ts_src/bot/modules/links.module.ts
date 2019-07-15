import { Permissions, Message } from 'discord.js';
import { UserArgs, ChannelData } from "../../discord";
import { DbManager, Responder, Logger } from '../../services';
import { UserData } from "../../discord";
import { str, Log, TryCatch, Mixin } from "../../utils";
import { Restricted } from "./restricted.module";
import { Cloner } from '../../utils/cloner';
const PERMISSION = Permissions.FLAGS;

@Mixin([Cloner])
export class Link implements Cloner {
    static clone: (other: Link) => Link;
    name: string;
    url: string;
    op: string;
    date: string;
    tags?: string[];
    constructor(name: str, url: str, op: str, date: str) {
        this.name = name;
        this.url = url;
        this.op = op;
        this.date = date;
    }
    static get curDate() {
        return (new Date(Date.now())).toISOString().split('T')[0];
    }
    toString(): string {
        return `${this.name} ${this.url}\nPosted by ${this.op} on ${this.date}`;
    }
}

@Mixin([Restricted])
export class Links implements Restricted {
    roles: string[];
    permissions: number;
    channels: string[];
    chtypes: string[];
    grantAccess: (user: UserData) => boolean;

    constructor(
        private dbService:  DbManager<Link>,
        private msgService: Responder,
        private logger:     Logger
    ) { }

    @TryCatch({
        callback: (err) => {
            if(!err) console.log(`Added new link.`);
        }
    })
    add(args: UserArgs, msg: Message) {
        const user = new UserData(msg.author, msg.member);
        const channel = new ChannelData(msg.channel, msg.guild);
        if(this.grantAccess(user) && channel.isText) {
            if(args.list[0] && args.url) {
                if(args.list[0].startsWith('_')) args.list[0] = args.list[0].substring(1);
                const link = new Link(args.list[0], args.url, user.name, Link.curDate);
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

    delete(args: UserArgs, msg: Message) {
        const user = new UserData(msg.author, msg.member);
        const channel = new ChannelData(msg.channel, msg.guild);
        if(this.grantAccess(user) && channel.isText) {
            if(args.list[0]) {
                if(this.dbService.has(args.list[0])) {
                    if(this.dbService.get(args.list[0]).op === user.name) {
                        this.dbService.delete(args.list[0]);
                        this.msgService.reply(msg, `Link has been deleted!`);
                    } else {
                        this.msgService.reply(msg, `Only the OP of a link can delete it.`)
                    }
                } else {
                    this.msgService.reply(msg, `I could not find that link!`);
                }
            } else {
                this.msgService.reply(msg, `You need to include the name of the link you want to delete.`);
            }
        } else {
            this.msgService.reply(msg, `You don't have access to this command in this channel!`);
        }
    }

    @TryCatch({
        callback: (err) => {
            if(!err) console.log('Success');
            else console.log(err);
        }
    })
    get(args: UserArgs, msg: Message) {
        if(args.list[0]) {
            const link = Link.clone(this.dbService.get(args.list[0]));
            if(link) this.msgService.send(msg, link.toString());
            else this.msgService.reply(msg, `I couldn't find that link. Use \`!addlink [linkname] <url>\` to add a new one.`)
        } else this.msgService.reply(msg, `You must include the name of the link!`);
    }
}
