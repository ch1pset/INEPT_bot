import * as auth from '../auth.json';
import { BotClient } from './bot/botclient';
import { Ping, Speedrun, Links, Link } from './bot/modules';
import * as Service from './services';
import { PERMISSIONS, UserArgs } from './discord';
import { Command } from './utils';
import { Message } from 'discord.js';


const bot = new BotClient(
    auth.token.bot,
    Service.Responder.self,
    Service.Logger.default
    );

bot.subscribe('login', (chLogger: Service.Logger) => {
    
    const dbTasker = new Service.Tasker(chLogger);
    const linksDB = new Service.DbManager<Link>(dbTasker, chLogger);
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

    const commands: Command[] = [
        ['ping',        (args, msg) => pinger.ping(args, msg)   ],
        ['addlink',     (args, msg) => links.add(args, msg)     ],
        ['deletelink',  (args, msg) => links.delete(args, msg)  ],
        ['getlink',     (args, msg) => links.get(args, msg)     ],
        ['wr',          (args, msg) => speedrun.wr(args, msg)   ],
        ['commands',    (args, msg) => msg.reply('You can use these commands:\n' + commands.map(([name, cb]) => '!' + name).join(', '))]
    ];
    bot.subscribeAll(commands);
});
