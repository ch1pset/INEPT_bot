import { UserArgs } from "../../discord/arguments";
import { Message } from "discord.js";
import * as Service from '../../services';

export const Speedrun = (
    msgService: Service.Responder,
    srcService: Service.SpeedrunCom,
    logger: Service.Logger) => {
    return {
        wr: (args: UserArgs, msg: Message) => {
            let response = '';
            logger.info('Fetching wr');
            if(args.list[0] && args.text.length > 0) {
                let game = args.list[0];
                let category = args.text[0];
                let variables = args.text.slice(1).map(a => a.split('='));
                let i = variables.findIndex(v => v[0]==='level');
                let level = (i !== -1)? variables.splice(i, 1)[0][1] : null;
                srcService.getWR(game, category, variables, level, (err, record) => {
                    if(!err) {
                        response = record ? record.weblink : "Not found. Make sure you used the correct info for your search.";
                    } else response = err.message;
                    msgService.reply(msg, response)})
            } else {
                msgService.reply(msg, `You need to include the game abbreviation, and the FULL CATEGORY name in double quotes("").`);
            }
        }
    }
}
