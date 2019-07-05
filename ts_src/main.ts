import * as auth from '../auth.json';
import { BotClient } from './bot/botclient';
import { Ping, Speedrun } from './bot/modules';
import * as Service from './services';

const bot = new BotClient(auth.token.test);
const ping = new Ping(Service.Responder.self);
const speedrun = new Speedrun(
    Service.Responder.self,
    Service.SpeedrunCom.self
    );

ping.subscribe(bot, 'ping')
    .subscribe(bot, 'pingme')
    .subscribe(bot, 'pinguser');

speedrun.subscribe(bot, 'wr');