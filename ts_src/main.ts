import * as auth from '../auth.json';
import { BotClient } from './bot/bot';
import { PingModule } from './bot/modules/ping-module';
import { SpeedrunModule } from './bot/modules/speedrun-module.js';

const bot = new BotClient(auth.token.test);
const ping = new PingModule();
// const speedrun = new SpeedrunModule();

ping.subscribe(bot, 'ping');
ping.subscribe(bot, 'pingme');
// speedrun.subscribe(bot, 'wr');
// speedrun.subscribe(bot, 'top');
// speedrun.subscribe(bot, 'place');