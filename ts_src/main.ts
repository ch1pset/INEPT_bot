import { api } from '../config.json';
import { BotClient } from './bot/botclient';
import { Links, Link, Ping, YLSrcom, Guides } from './bot/modules';
import * as Service from './services';
import { PERMISSIONS, AccessRestrictions, UserArgs } from './discord';
import { Command } from './utils/typedefs';
import { Message } from 'discord.js';

const token = api.discord.bot;
const respondService = new Service.Responder();
const bot = new BotClient(
    token, 
    respondService, 
    Service.Logger.default
    );
const access = new AccessRestrictions(
    ['Mods', 'Runners', 'Community-Dev', 'Dev', 'Testers'],
    PERMISSIONS.ADMINISTRATOR | PERMISSIONS.BAN_MEMBERS | PERMISSIONS.KICK_MEMBERS
    );

bot.subscribe('login', () => {
    const dbTasker =        new Service.Tasker(Service.Logger.default);
    const httpService =     new Service.HttpsRequest(Service.Logger.default);
    const linksDB =         new Service.DbManager<Link>('./links.json', dbTasker, Service.Logger.default);
    const ylService =       new Service.SrGameManager('yl', httpService, Service.Logger.default);
    const guidesService =   new Service.Sheet<string[]>(httpService, Service.Logger.default);

    const pinger =          new Ping(respondService, Service.Logger.default);
    const ylsr =            new YLSrcom(respondService, ylService, Service.Logger.default);
    const links =           new Links(access, linksDB, respondService, Service.Logger.default);
    const guides =          new Guides(guidesService, respondService, Service.Logger.default);

    const cmdlist = (args: UserArgs.Model, msg: Message) => {
        msg.reply('You can use these commands:\n' + commands.map(([name, cb]) => '!' + name).join(', '))
    }

    const commands: Command[] = [
        ['ping',            pinger.ping     ],
        ['pingme',          pinger.pingme   ],
        ['pinguser',        pinger.pinguser ],
        ['wrpc',            ylsr.wrpc       ],
        ['wrcon',           ylsr.wrcon      ],
        ['addlink',         links.add       ],
        ['deletelink',      links.delete    ],
        ['getlink',         links.get       ],
        ['guides',          guides.link     ],
        ['guide',           guides.get      ],
        ['refreshguides',   guides.refresh  ],
        ['commands',        cmdlist         ]
    ];
    bot.subscribeAll(commands);
});
