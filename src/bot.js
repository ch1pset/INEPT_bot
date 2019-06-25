/**
 * Discord Bot Class
 * 
 * @author ch1pset
 * @file This file contains the implementation of the discord bot class.
 * 
 * @requires Discord
 * 
 * @since 2019-3-10
 * @version 2019.4.29
 * @license MIT
 */

const console = require('console')
const Discord = require('discord.js')
const BotModules = require('./modules.js')
/**
 * Bot Class
 * 
 * @class Bot
 * @extends Discord.Client
 */
module.exports = class Bot extends Discord.Client
{
    constructor(token)
    {
        super();
        this.initialize();
        this.login(token);
    }

    /**
     * Initialize event listeners
     * 
     * @method
     * @private
     * @event
     */
    initialize()
    {
        this.on('message', msg =>
        {
            let send = (TYPE, MESSAGE) =>
            {
                switch(TYPE)
                {
                    case "reply":
                    msg.reply(MESSAGE);
                    break;
        
                    case "channel":
                    // msg.guild.channels.find(c => c.name === res.CHANNEL).send(res.MESSAGE);
                    msg.channel.send(MESSAGE);
                    break;
        
                    case "dm":
                    msg.author.send(MESSAGE);
                    break;
        
                    default:
                    // msg.channel.send(res.MESSAGE);
                    break;
                }
            }
            let respond = ({TYPE, MESSAGE}) =>
            {
                if(MESSAGE.length > 1900)
                {
                    let m = [];
                    m.push(MESSAGE.substring(0,1900));
                    m.push(MESSAGE.substring(1900));
                    send("dm", m[0]);
                    send("dm", m[1]);
                }
                else send(TYPE, MESSAGE);
            };
            if(msg.content[0] === "!")
            {
                console.log(`User ${msg.author.username} sent: ${msg.content}`);
                let args = this.parseInput(msg.content);
                let mod = BotModules[args.cmd];
                if(mod) mod.execute(args, msg, respond);
            }
        });
    }

    /**
     * Parse user input string.
     * 
     * @method
     * @private
     * @param {string} usrInput
     * @returns {args} 
     */
    parseInput(usrInput)
    {
        let regx = /^!([a-zA-Z0-9]+)|-([a-zA-Z0-9]+)|"(.{1,300}?)"|```\w{0,9}([\w\W]{1,1500}?)```|(https?:\/\/[^ "<>\\^`{|}\s]{1,500})|([\w!-/@?]+)/g;
        let args = {cmd:"", opt:[], text:[], code:"", url:"", list:[]};
        let arr = [];
        while((arr = regx.exec(usrInput)) !== null)
        {
            if(arr[1] && !args.cmd) args.cmd = arr[1];
            if(arr[2]) args.opt.push(arr[2]);
            if(arr[3]) args.text.push(arr[3]);
            if(arr[4] && !args.code) args.code = arr[4];
            if(arr[5] && !args.url) args.url = arr[5];
            if(arr[6]) args.list.push(arr[6]);
        }
        return args;
    }
}

/* 
!link-add "a link name" https://link.com/something?var=value&var=2435 tag1 tag2 tag3 
!link-add-tags "a link name" tag5
!link-del-tags "a link name" tag2 tag3
!link-del-tags tag1 tag3 "a link name" tag5 https://link.com/something?var=value&var=2341

!wr yl "Any% w/ Flight" "Platform Route=PC"

!guide-add "Guide 1" 
```md
##Guide 1
+Step 1 - Explanation goes here
+Step 2 - Next explanation
+Step 3 - continue until done
```

!guide "Guide 1"
*/