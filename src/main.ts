import { api }          from '../config/tokens.json';
import { BotClient }    from './bot/botclient';
import { Command }      from './utils/typedefs';
import { Link }         from './utils/structures';
import {
    PERMISSIONS, 
    AccessRestrictions
} from './discord';

import * as Cmd         from './commands';
import * as Service     from './services';

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

bot.on('login', () => {
    const dbTasker =        new Service.Tasker(Service.Logger.default);
    const httpService =     new Service.HttpsRequest(Service.Logger.default);
    const linksDB =         new Service.DbManager<Link>('./storage/links.json', dbTasker, Service.Logger.default);
    const ylService =       new Service.SrGameManager('yl', httpService, Service.Logger.default);
    const guidesService =   new Service.Sheet<string[]>(httpService, Service.Logger.default);

    const pinger =          new Cmd.Ping(respondService, Service.Logger.default);
    const ylsr =            new Cmd.YLSrcom(respondService, ylService, Service.Logger.default);
    const links =           new Cmd.Links(access, linksDB, respondService, Service.Logger.default);
    const guides =          new Cmd.Guides(guidesService, respondService, Service.Logger.default);
    const control =         new Cmd.Control(bot);

    const commands: Command[] = [
        // ['ping',            pinger.ping     ],
        // ['pingme',          pinger.pingme   ],
        // ['pinguser',        pinger.pinguser ],
        ['wrpc',            ylsr.wrpc       ],
        ['wrcon',           ylsr.wrcon      ],
        // ['addlink',         links.add       ],
        // ['deletelink',      links.delete    ],
        // ['getlink',         links.get       ],
        ['guides',          guides.link     ],
        ['guide',           guides.get      ],
        ['refreshguides',   guides.refresh  ],
        ['commands',        control.cmdlist ]
    ];
    bot.subscribeAll(commands);
});
