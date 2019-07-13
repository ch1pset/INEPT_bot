import * as auth from '../auth.json';
import { BotClient } from './bot/botclient';
import { Ping, Speedrun, Links } from './bot/modules';
import * as Service from './services';
import { ILink } from './bot/modules/link.js';
import { PERMISSIONS, UserArgs } from './discord';

const bot = new BotClient(
    auth.token.bot,
    Service.Responder.self,
    Service.Logger.default
    );

bot.on('login', (chLogger: Service.Logger) => {
    
    const dbTasker = new Service.Tasker(chLogger);
    const linksDB = new Service.DbManager<ILink>(dbTasker, chLogger);
    linksDB.load('./links.json');

    const pinger = new Ping(
        Service.Responder.self,
        chLogger
        );

    // const srTasker = new Service.Tasker(chLogger);
    const speedrun = new Speedrun(
        Service.Responder.self,
        Service.SpeedrunCom.self,
        chLogger
        );
    const links = new Links(
        linksDB,
        Service.Responder.self,
        chLogger
        );
    links.roles = ['Mods', 'Runners', 'Community-Dev', 'Dev', 'Testers'];
    links.permissions = PERMISSIONS.ADMINISTRATOR | PERMISSIONS.BAN_MEMBERS | PERMISSIONS.KICK_MEMBERS;

    bot.subscribe('ping', 
            (args, msg) => pinger.ping(args, msg))
        .subscribe('pingme', 
            (args, msg) => pinger.pingme(args, msg))
        .subscribe('pinguser', 
            (args, msg) => pinger.pinguser(args, msg))

        .subscribe('addlink', 
            (args, msg) => links.addlink(args, msg))
        .subscribe('getlink', 
            (args, msg) => links.getlink(args, msg))

        .subscribe('wr', 
            (args, msg) => speedrun.wr(args, msg));
    });