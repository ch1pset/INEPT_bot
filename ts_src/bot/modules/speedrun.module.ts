import { BotModule } from "./base.module";
import { UserArgs } from "../../user/arguments";
import { Message } from "discord.js";
import { NodeCallback } from "../../utils/typedefs";
import * as Services from '../../services/index';

export class SpeedrunModule extends BotModule
{
    constructor(
        private msgService: Services.Responder,
        private speedrunService: Services.SpeedrunCom
    ) {
        super();
    }

    // @Log('Found run: $(run)')
    getRecord(abrv: string, cat: string, vars: string[][], lvl: string, cb: NodeCallback<Error, any>) {
        this.speedrunService.getLeader(abrv, cat, vars, lvl, (err, leader) => {
            const record = leader.runs.find(r => r.place === 1).run;
            if(record) cb(null, record);
            else cb(err, null)
        });
    }

    async wr(args: UserArgs, msg: Message) {
        let response = '';
        console.log('Fetching wr');
        if(args.list[0] && args.text.length > 0) {
            let game = args.list[0];
            let category = args.text[0];
            let variables = args.text.slice(1).map(a => a.split('='));
            let i = variables.findIndex(v => v[0]==='level');
            let level = (i !== -1)? variables.splice(i, 1)[0][1] : null;
            this.getRecord(game, category, variables, level, (err, record) => {
                if(!err) {
                    response = record? record.weblink : "Not found. Make sure you used the correct info for your search.";
                }
                else {
                    response = err.message;
                }
                this.msgService.reply(msg, response);
            })
        }
    }
}