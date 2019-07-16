import { api } from '../config.json';
import { BotClient } from './bot/botclient';
import { Links, Link, Speedrun, Ping, AccessRestrictions } from './bot/modules';
import * as Service from './services';
import { PERMISSIONS } from './discord';
import { Command } from './utils';

const token = api.discord.bot;
const respondService = new Service.Responder();
const bot = new BotClient(token, respondService, Service.Logger.default);

bot.subscribe('login', (chLogger: Service.Logger) => {
    
    const dbTasker = new Service.Tasker(chLogger);
    const srcomService = new Service.SpeedrunCom();
    const linksDB = new Service.DbManager<Link>(dbTasker, chLogger);
    const access = new AccessRestrictions(
        ['Mods', 'Runners', 'Community-Dev', 'Dev', 'Testers'],
        PERMISSIONS.ADMINISTRATOR | PERMISSIONS.BAN_MEMBERS | PERMISSIONS.KICK_MEMBERS);
    linksDB.load('./links.json');

    const pinger =      Ping(respondService, chLogger);
    const speedrun =    Speedrun(respondService, srcomService, chLogger);
    const links =       Links(access, linksDB, respondService, chLogger);

    const commands: Command[] = [
        ['ping',        pinger.ping ],
        ['wr',          speedrun.wr ],
        ['addlink',     links.add   ],
        ['deletelink',  links.delete],
        ['getlink',     links.get   ],
        ['commands',    (args, msg) => msg.reply('You can use these commands:\n' + commands.map(([name, cb]) => '!' + name).join(', '))]
    ];
    bot.subscribeAll(commands);
});
