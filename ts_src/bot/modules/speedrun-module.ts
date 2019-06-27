import { BotModule } from "./module";
import { UserArgs } from "../../user/arguments";
import { Message } from "discord.js";
import { IBotResponse, Response } from "../response";
import { SpeedrunComService } from "../../speedrun/api";
import { Inject } from "../../utils/injector";

export class SpeedrunModule extends BotModule
{
    @Inject(SpeedrunComService) 
    private srcapi: SpeedrunComService;

    private RESPONSE: IBotResponse = {
        TYPE: Response.REPLY,
        MSG: ''
    }
    constructor() {
        super();
    }

    public async getRecord(abrv: string, cat: string, vars: string[][], lvl: string) {
        const leaderboard = await this.srcapi.getLeader(abrv, cat, vars, lvl);
        return leaderboard.runs.find((r: any) => r.place === 1).run;
    }
    public async getTop(num: number, abrv: string, cat: string, vars: string[][], lvl: string) {
        let leaderboard = await this.srcapi.getLeader(abrv, cat, vars, lvl);
        return leaderboard.runs.slice(0, num);
    }
    public async getPlace(num: number, abrv: string, cat: string, vars: string[][], lvl: string) {
        let leaderboard = await this.srcapi.getLeader(abrv, cat, vars, lvl);
        return leaderboard.runs.find((r: any) => r.place === num).run;
    }

    public async wr(args: UserArgs, msg: Message, send: (msg: Message, res: IBotResponse) => void) {
        let response = this.RESPONSE;
        console.log('Fetching wr');
        if(args.list[0] && args.text.length > 0) {
            let game = args.list[0];
            let category = args.text[0];
            let variables = args.text.slice(1).map(a => a.split('='));
            let i = variables.findIndex(v => v[0]==='level');
            let level = (i !== -1)? variables.splice(i, 1)[0][1] : null;
            let run = await this.getRecord(game, category, variables, level);
            response.MSG = run.weblink? run.weblink : "Not found. Make sure you used the correct info for your search.";
            send(msg, response);
        }
    }

    public async top(args: UserArgs, msg: Message, send: (msg: Message, res: IBotResponse) => void) {
        let response = this.RESPONSE
        if(args.list.length === 2 && args.text.length > 0)
        {
            let top = Number.parseInt(args.list[0]);
            let game = args.list[1];
            let category = args.text[0];
            let variables = args.text.slice(1).map(a => a.split('='));
            let i = variables.findIndex(v => v[0]==='level');
            let level = (i !== -1)? variables.splice(i, 1)[0][1] : null;
            let leaderboard = await this.getTop(top, game, category, variables, level);
            let runs = leaderboard.runs.slice(0, top);
            response.MSG = runs.map((r: any) => r.run.weblink).join('\n');
            response.TYPE = Response.DM;
            send(msg, response);
        }
    }

    public async place(args: UserArgs, msg: Message, send: (msg: Message, res: IBotResponse) => void) {
        let response = this.RESPONSE
        if(args.list.length === 2 && args.text.length > 0)
        {
            let place = Number.parseInt(args.list[0]);
            let game = args.list[1];
            let category = args.text[0];
            let variables = args.text.slice(1).map(a => a.split('='));
            let i = variables.findIndex(v => v[0]==='level');
            let level = (i !== -1)? variables.splice(i, 1)[0][1] : null;
            let run = await this.getPlace(place, game, category, variables, level);
            response.MSG = run.weblink
            send(msg, response);
        }
    }
}