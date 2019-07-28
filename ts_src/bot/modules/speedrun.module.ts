import { UserArgs } from "../../discord/arguments";
import { Message } from "discord.js";
import * as Service from '../../services';
import { Resource } from '../../services/speedrun';

export const Speedrun = (
    msgService: Service.Responder,
    gameService: Service.SrGameManager,
    logger: Service.Logger) => {
    return {
        wr: (args: UserArgs, msg: Message) => {
            const {category, top, platform} = {
                category: args.text[0],
                top: 1,
                platform: args.list[0]
            }
            gameService.getLeaderboard({category, top, platform})
            .once('ready', (leaderboard: Resource.Leaderboard) => {
                msgService.send(msg, leaderboard.runs[0].run.weblink);
            })
            .once('error', err => msgService.reply(msg, `I couldn't find that wr.`));
        }
    }
}
