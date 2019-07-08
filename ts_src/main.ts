import * as auth from '../auth.json';
import { BotClient } from './bot/botclient';
import { Ping, Speedrun, Links } from './bot/modules';
import * as Service from './services';
import { ILink } from './bot/modules/link.js';
import { PERMISSIONS, UserArgs } from './discord';

const logger = new Service.Logger({
    stdout: process.stdout,
    colorMode: true
    });

const linksDB = new Service.DbManager<ILink>(logger);
linksDB.load('./links.json');

const bot = new BotClient(auth.token.bot);
const ping = new Ping(
    Service.Responder.self,
    logger
    );
const speedrun = new Speedrun(
    Service.Responder.self,
    Service.SpeedrunCom.self,
    logger
    );
const links = new Links(
    linksDB,
    Service.Responder.self,
    logger
    );
links.roles = ['Mods', 'Runners', 'Community-Dev', 'Dev', 'Tester'];
links.permissions = PERMISSIONS.ADMINISTRATOR | PERMISSIONS.BAN_MEMBERS | PERMISSIONS.KICK_MEMBERS;

ping.subscribe(bot, 'ping')
    .subscribe(bot, 'pingme')
    .subscribe(bot, 'pinguser');

speedrun.subscribe(bot, 'wr');

links.subscribe(bot, 'addlink')
     .subscribe(bot, 'getlink');