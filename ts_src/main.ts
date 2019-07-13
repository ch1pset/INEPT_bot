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

bot.when('login', (chLogger: Service.Logger) => {
    
    const dbTasker = new Service.Tasker(chLogger);
    const linksDB = new Service.DbManager<ILink>(dbTasker, chLogger);
    linksDB.load('./links.json');

    const ping = new Ping(
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
    
    ping.subscribe(bot, 'ping')
        .subscribe(bot, 'pingme')
        .subscribe(bot, 'pinguser');
    
    speedrun.subscribe(bot, 'wr');
    
    links.subscribe(bot, 'addlink')
         .subscribe(bot, 'getlink');
    });