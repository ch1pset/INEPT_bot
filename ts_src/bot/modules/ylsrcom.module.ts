import { UserArgs } from "../../discord";
import { Message } from "discord.js";
import * as Service from '../../services';
import { Resource } from '../../services/speedrun';
import { Dictionary } from "../../utils/structures";

type Category = {name: string, alias: string[]};


export function YLSrcom(
    msgService: Service.Responder,
    gameService: Service.SrGameManager,
    logger: Service.Logger) {

    const YlCatList = new Dictionary<Category>();
    YlCatList.loadFromFile('./config/categories.json', (err, succ) => {
        if(!err) {
            logger.info(`Categories have been loaded.`);
        }
    });

    this.wrpc = function(args: UserArgs.Model, msg: Message) {
        if(gameService.isReady) {
            const catInput = args.list[0] ? args.list[0].toLowerCase() : '';
            const catFound = YlCatList.find((c: Category) => c.alias.includes(catInput));
            gameService.getLeaderboard({
                category: catFound ? catFound.name : null,
                top: 1,
                platform: 'PC'
            })
            .once('ready', (leaderboard: Resource.Leaderboard) => {
                msgService.send(msg, leaderboard.runs[0].run.weblink);
            })
            .once('error', err => msgService.reply(msg, `I couldn't find that wr.`));
        } else {
            msgService.reply(msg, `Please wait a minute, I'm busy!`);
        }
    }
    this.wrcon = function(args: UserArgs.Model, msg: Message) {
        if(gameService.isReady) {
            const catInput = args.list[0] ? args.list[0].toLowerCase() : '';
            const catFound = YlCatList.find((c: Category) => c.alias.includes(catInput));
            gameService.getLeaderboard({
                category: catFound ? catFound.name : null,
                top: 1,
                platform: 'Console'
            })
            .once('ready', (leaderboard: Resource.Leaderboard) => {
                msgService.send(msg, leaderboard.runs[0].run.weblink);
            })
            .once('error', err => msgService.reply(msg, `I couldn't find that wr.`));
        } else {
            msgService.reply(msg, `Please wait a minute, I'm busy!`);
        }
    }
}
