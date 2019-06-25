

const console = require('console');
const Discord = require('discord.js');
const PERMISSION = Discord.Permissions.FLAGS;

const util = require('../utils.js');
const srcapi = require('../srcapi.js');
const Struct = require('../structures.js');

module.exports = class PingModule extends BotModule
{
    constructor()
    {
        super();
    }
    execute(args, msg, respond)
    {
        let {TYPE="reply",MESSAGE="Pong!"};
        switch(args.opt)
        {
            case "me": TYPE = "dm"; break;
            default: break;
        }
        respond({TYPE, MESSAGE});
    }
}