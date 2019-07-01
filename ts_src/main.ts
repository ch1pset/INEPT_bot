import * as auth from '../auth.json';
import { BotClient } from './bot/botclient';
import { PingModule } from './bot/modules/ping.module';
import { SpeedrunModule } from './bot/modules/speedrun.module.js';
import { SpeedrunCom } from './speedrun/speedrun.service.js';
import { Responder } from './bot/services/respond.service.js';

const bot = new BotClient(auth.token.test);

const ping = new PingModule(Responder.self);
const speedrun = new SpeedrunModule(
    Responder.self,
    SpeedrunCom.self
);

ping.subscribe(bot, 'ping');
ping.subscribe(bot, 'pingme');
ping.subscribe(bot, 'pinguser');
speedrun.subscribe(bot, 'wr');