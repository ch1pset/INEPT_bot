import { api } from '../config.json';
import { BotClient } from './bot/botclient';
import { Links, Link, Ping, AccessRestrictions, Speedrun } from './bot/modules';
import * as Service from './services';
import { PERMISSIONS } from './discord';
import { Command } from './utils/typedefs';
import { HttpsRequest } from './services/http.service.js';

const token = api.discord.bot;
const respondService = new Service.Responder();
const bot = new BotClient(token, respondService, Service.Logger.default);

bot.subscribe('login', (chLogger: Service.Logger) => {
    
    const dbTasker = new Service.Tasker(chLogger);
    const httpService = new HttpsRequest(chLogger);
    const linksDB = new Service.DbManager<Link>(dbTasker, chLogger);
    const access = new AccessRestrictions(
        ['Mods', 'Runners', 'Community-Dev', 'Dev', 'Testers'],
        PERMISSIONS.ADMINISTRATOR | PERMISSIONS.BAN_MEMBERS | PERMISSIONS.KICK_MEMBERS);
        linksDB.load('./links.json');
    const ylService = new Service.SrGameManager('yl', httpService, chLogger);

    const pinger =      Ping(respondService, chLogger);
    const ylsr =        Speedrun(respondService, ylService, chLogger);
    const links =       Links(access, linksDB, respondService, chLogger);

    const commands: Command[] = [
        ['ping',        pinger.ping ],
        ['wr',          ylsr.wr ],
        ['addlink',     links.add   ],
        ['deletelink',  links.delete],
        ['getlink',     links.get   ],
        ['commands',    (args, msg) => msg.reply('You can use these commands:\n' + commands.map(([name, cb]) => '!' + name).join(', '))]
    ];
    bot.subscribeAll(commands);
});
