
const Discord = require('discord.js')
const util = require('./utils.js')
const srcapi = require('./srcapi.js')
const Struct = require('./structures.js')

const PERMISSION = Discord.Permissions.FLAGS;

const Links  = require('./botmodules/dbmodule.js')
const SRCapi = require('./botmodules/srcapimodule.js')
const Stream = require('./botmodules/streammodule.js')
const Ping = require('./botmodules/pingmodule.js')

class CustomModule extends BotModule
{
    constructor()
    {
        super();
    }
    execute(args, msg, respond)
    {
        let name = args.list[0];
        module.exports[name] = new BotModule();
        module.exports[name].execute = (a, m, r) =>
        {
            r({TYPE="channel", MESSAGE=args.text[0]});
        }
        respond({
            TYPE="channel", 
            MESSAGE=`Command ${name} created!`
        })
    }
}

class CountModule extends BotModule
{
    constructor()
    {
        super();
    }
    execute(args, msg, respond)
    {
        let name = args.list[0];
        module.exports[name] = new BotModule();
        module.exports[name].value = 0;
        module.exports[name].execute = (a, m, r) =>
        {
            switch(a.opt[0])
            {   
                case "reset":
                    module.exports[name].value = 0;
                    break;
                default: 
                    module.exports[name].value++;
                    break;
            }
            r({
                TYPE="channel",
                MESSAGE=args.text[0].replace(/\$[a-zA-Z]+/, `${module.exports[name].value}`)
            });
        }
    }
}

module.exports = {
    link:new Links(),
    src:new SRCapi(),
    stream:new Stream(),
    ping:new Ping()
};