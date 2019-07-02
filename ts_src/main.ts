import * as auth from '../auth.json';
import { BotClient } from './bot/botclient';
import { PingModule } from './bot/modules/ping.module';
import { SpeedrunModule } from './bot/modules/speedrun.module.js';
import * as Service from './services/index';

const bot = new BotClient(auth.token.test);
const ping = new PingModule(Service.Responder.self);
const speedrun = new SpeedrunModule(
    Service.Responder.self,
    Service.SpeedrunCom.self
    );
const respond = new Service.Responder();

ping.subscribe(bot, 'ping')
    .subscribe(bot, 'pingme')
    .subscribe(bot, 'pinguser');

speedrun.subscribe(bot, 'wr');