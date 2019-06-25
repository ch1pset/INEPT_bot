
const console = require('console');
const Discord = require('discord.js');
const PERMISSION = Discord.Permissions.FLAGS;

const util = require('./utils.js');
const srcapi = require('./srcapi.js');
const Struct = require('./structures.js');


module.exports = class StreamModule extends BotModule
{
    constructor()
    {
        super();
    }
    execute(args, msg, respond)
    {
        let {TYPE="channel", MESSAGE=""};
        let url;
        switch(args.opt)
        {
            case "mixer":
            case "m":
                url = "https://mixer.com/"
                break;
            case "youtube":
            case "yt":
            case "y":
                url = "https://youtube.com/user/"
                break;
            default:
                url = "https://twitch.tv/"
                break;
        }
        if(args.list.length > 0)
        {
            MESSAGE = `${url}${args.list[0]}`;
        }
        else MESSAGE = `${url}${msg.author.username}`;
        respond({TYPE, MESSAGE});
    }
}