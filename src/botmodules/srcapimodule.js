
const Discord = require('discord.js');
const PERMISSION = Discord.Permissions.FLAGS;

const util = require('./utils.js');
const srcapi = require('./srcapi.js');
const Struct = require('./structures.js');
const BotModule = require('../src/default.js');

const { SRC_MODULE_CONFIG } = require('../../config/config.js');

module.exports = class SRCModule extends BotModule
{
    constructor()
    {
        super();
    }
    async getRecord(abrv, cat, vars, lvl)
    {
        let leaderboard = await srcapi.leaderboard(abrv, cat, vars, lvl);
        return leaderboard.runs.find(r => r.place === 1).run;
    }
    async getTop(num, abrv, cat, vars, lvl)
    {
        let leaderboard = await srcapi.leaderboard(abrv, cat, vars, lvl);
        return leaderboard.runs.slice(0, num);
    }
    async getPlace(num, abrv, cat, vars, lvl)
    {
        let leaderboard = await srcapi.leaderboard(abrv, cat, vars, lvl);
        return leaderboard.runs.find(r => r.place === num).run;
    }
    async execute(args, msg, respond)
    {
        let {TYPE="reply", MESSAGE="Sorry, I couldn't find what you requested."};
        switch(args.opt[0])
        {
            case "wr":
                if(args.list[0] && args.text.length > 0)
                {
                    let game = args.list[0];
                    let category = args.text[0];
                    let variables = args.text.slice(1).map(a => a.split('='));
                    let i = variables.findIndex(v => v[0]==='level');
                    let level = (i !== -1)? variables.splice(i, 1)[0][1] : null;
                    let run = await this.getRecord(game, category, variables, level);
                    MESSAGE = run.weblink? run.weblink : "Not found. Make sure you used the correct info for your search.";
                }
                else 
                {
                    MESSAGE = "```md\n"
                    MESSAGE += "The wr option takes the following arguments in order:\n"
                    MESSAGE += "+ The game abbreviation(yl, yltoybox, ylmemes)\n"
                    MESSAGE += "+ The category by exact name(with spaces) on SRC leaderboard inside \"\"\n"
                    MESSAGE += "+ Variables in the form: \"variable name=value\"\n"
                    MESSAGE += "```\n"
                    MESSAGE += "```md\n"
                    MESSAGE += "**Examples**\n";
                    MESSAGE += "============\n"
                    MESSAGE += "# !src-wr yl \"Any% W/ Flight\" \"Platform Route=Console\"\n"
                    MESSAGE += "# !src-wr smo \"Darker Side\" \"Skips=Frog Skip\"\n";
                    MESSAGE += "# !src-wr mp \"Any%\" \"Difficulty=Hard\"\n"
                    MESSAGE += "```"
                    TYPE = "dm";
                }
                break;
            case "top":
                if(args.list.length === 2 && args.text.length > 0)
                {
                    let top = Number.parseInt(args.list[0]);
                    let game = args.list[1];
                    let category = args.text[0];
                    let variables = args.text.slice(1).map(a => a.split('='));
                    let i = variables.findIndex(v => v[0]==='level');
                    let level = (i !== -1)? variables.splice(i, 1)[0][1] : null;
                    let runs = await this.getTop(top, game, category, variables, level);
                    MESSAGE = runs.map(r => r.run.weblink).join('\n');
                    TYPE = "dm";
                }
                else
                {
                    MESSAGE = "```md\n"
                    MESSAGE += "The top option takes the following arguments in order:\n"
                    MESSAGE += "+ The number of runs\n"
                    MESSAGE += "+ The game abbreviation(yl, yltoybox, ylmemes)\n"
                    MESSAGE += "+ The category by exact name(with spaces) on SRC leaderboard inside \"\"\n"
                    MESSAGE += "+ Variables in the form: \"variable name=value\"\n"
                    MESSAGE += "```\n"
                    MESSAGE += "```md\n"
                    MESSAGE += "**Examples**\n";
                    MESSAGE += "============\n"
                    MESSAGE += "# !src-top 5 yl \"Any% W/ Flight\" \"Platform Route=Console\"\n"
                    MESSAGE += "# !src-top 10 smo \"Darker Side\" \"Skips=Frog Skip\"\n";
                    MESSAGE += "# !src-top 3 mp \"Any%\" \"Difficulty=Hard\"\n"
                    MESSAGE += "```"
                    TYPE = "dm";
                }
                break;
            case "place":
                if(args.list.length === 2 && args.text.length > 0)
                {
                    let place = Number.parseInt(args.list[0]);
                    let game = args.list[1];
                    let category = args.text[0];
                    let variables = args.text.slice(1).map(a => a.split('='));
                    let i = variables.findIndex(v => v[0]==='level');
                    let level = (i !== -1)? variables.splice(i, 1)[0][1] : null;
                    let run = await this.getPlace(place, game, category, variables, level);
                    MESSAGE = run.weblink
                }
                else
                {
                    MESSAGE = "```md\n"
                    MESSAGE += "The place option takes the following arguments in order:\n"
                    MESSAGE += "+ The place of the run\n"
                    MESSAGE += "+ The game abbreviation(yl, yltoybox, ylmemes)\n"
                    MESSAGE += "+ The category by exact name(with spaces) on SRC leaderboard inside \"\"\n"
                    MESSAGE += "+ Variables in the form: \"variable name=value\"\n"
                    MESSAGE += "```\n"
                    MESSAGE += "```md\n"
                    MESSAGE += "**Examples**\n";
                    MESSAGE += "============\n"
                    MESSAGE += "# !src-place 5 yl \"Any% W/ Flight\" \"Platform Route=Console\"\n"
                    MESSAGE += "# !src-place 10 smo \"Darker Side\" \"Skips=Frog Skip\"\n";
                    MESSAGE += "# !src-place 3 mp \"Any%\" \"Difficulty=Hard\"\n"
                    MESSAGE += "```"
                    TYPE = "dm";
                }
                break;
            case "categories":
                if(args.list[0])
                {
                    let game = await srcapi.game(args.list[0]);
                    MESSAGE = game.categories.map(category => category.name).join(', ');
                    TYPE = "dm";
                }
                else
                {
                    MESSAGE = "```md\n";
                    MESSAGE += "The categories option requires a game abbreviation\n"
                    MESSAGE += "**Example**\n";
                    MESSAGE += "# !src-categories supermetroid\n";
                    MESSAGE += "```\n"
                    TYPE = "dm";
                }
                break;
            case "variables":
                if(args.list[0])
                {
                    let game = await srcapi.game(args.list[0]);
                    MESSAGE = game.variables.map(variable => `${variable.name}: ${variable.getValueLabels().join(', ')}`).join('\n');
                    TYPE = "dm";
                }
                else
                {
                    MESSAGE = "```md\n";
                    MESSAGE += "The variables option requires a game abbreviation\n"
                    MESSAGE += "**Example**\n";
                    MESSAGE += "# !src-variables supermetroid\n";
                    MESSAGE += "```\n"
                    TYPE = "dm";
                }
                break;
            case "levels":
                if(args.list[0])
                {
                    let game = await srcapi.game(args.list[0]);
                    MESSAGE = game.levels.map(level => level.name).join(', ');
                    TYPE = "dm";
                }
                else
                {
                    MESSAGE = "```md\n";
                    MESSAGE += "The levels option requires a game abbreviation\n"
                    MESSAGE += "**Example**\n";
                    MESSAGE += "# !src-levels sm64\n";
                    MESSAGE += "```\n"
                    TYPE = "dm";
                }
                break;
        }
        respond({TYPE, MESSAGE});
    }
}