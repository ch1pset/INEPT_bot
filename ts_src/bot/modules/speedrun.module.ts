import { BotModule } from "./base.module";
import { UserArgs } from "../../discord/arguments";
import { Message } from "discord.js";
import { NodeCallback } from "../../utils";
import * as Service from '../../services';

export class Speedrun extends BotModule
{
    constructor(
        private msgService:     Service.Responder,
        private srcomService:   Service.SpeedrunCom,
        private logger:         Service.Logger
    ) {
        super();
    }

    wr(args: UserArgs, msg: Message) {
        let response = '';
        this.logger.info('Fetching wr');
        if(args.list[0] && args.text.length > 0) {
            let game = args.list[0];
            let category = args.text[0];
            let variables = args.text.slice(1).map(a => a.split('='));
            let i = variables.findIndex(v => v[0]==='level');
            let level = (i !== -1)? variables.splice(i, 1)[0][1] : null;
            this.srcomService.getWR(game, category, variables, level, (err, record) => {
                if(!err) {
                    response = record? record.weblink : "Not found. Make sure you used the correct info for your search.";
                }
                else {
                    response = err.message;
                }
                this.msgService.reply(msg, response)})
        }
    }
}