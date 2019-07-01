import * as auth from '../auth.json';
import { BotClient } from './bot/botclient';
import { PingModule } from './bot/modules/ping.module';
import { SpeedrunModule } from './bot/modules/speedrun.module.js';
import { SpeedrunService } from './speedrun/speedrun.service.js';
import { RespondService } from './bot/services/respond.service.js';

const bot = new BotClient(auth.token.test);

const msgService = new RespondService();
const speedrunService = new SpeedrunService();

const ping = new PingModule(msgService);
const speedrun = new SpeedrunModule(msgService, speedrunService);

ping.subscribe(bot, 'ping');
ping.subscribe(bot, 'pingme');
ping.subscribe(bot, 'pinguser');
speedrun.subscribe(bot, 'wr');