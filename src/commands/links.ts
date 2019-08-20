import { Message } from 'discord.js';
import { UserArgs, UserData, ChannelData, AccessRestrictions } from "../discord";
import { DbManager, Responder, Logger } from '../services';
import { Link } from '../utils/structures';

export function Links(
    access:     AccessRestrictions,
    dbService:  DbManager<Link>,
    msgService: Responder,
    logger:     Logger
    ) {
        
    this.add = function(args: UserArgs.Model, msg: Message) {
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
    }
    
    this.delete = function(args: UserArgs.Model, msg: Message) {
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
    }

    this.get = function(args: UserArgs.Model, msg: Message) {
        if(args.list[0]) {
            const link = Link.clone(dbService.get(args.list[0]));
            if(link) msgService.send(msg, link.toString());
            else msgService.reply(msg, `I couldn't find that link. Use \`!addlink [linkname] <url>\` to add a new one.`)
        } else msgService.reply(msg, `You must include the name of the link!`);
    }
}
