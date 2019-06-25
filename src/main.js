/**
 * Main Program Script.
 * 
 * Runs a console application that is used as an interface for running one
 * or more Discord clients. All clients implement the same interfaces and
 * APIs.
 * 
 * @author ch1pset
 * @file Entry point for discord bot app.
 * 
 * @since 2019-3-3
 * @version 2019.4.29
 * @license MIT
 */

 
/** 
 * Contains discord.js classes and properties.
 * 
 * @namespace Discord 
 */
const Discord = require('discord.js');
/** 
 * Contains auth tokens
 * 
 * @constant auth
 * */
const auth = require('../auth.json');
/**
 * File System Module
 * @module
 */
const fs = require('fs');
/**
 * Console interface
 * 
 * @interface console
 */
const {Console} = require('console');

/**
 * Bot class
 */
const Bot = require('./bot.js');

/**
 * Prints to console, logs errors to crash.log
 * @constant
 * @type console
 */
const logger = new Console({
        stdout:process.stdout,
        stderr:fs.createWriteStream('./crash.log')
});


/**
 * Initialize Discord Client Array.
 * 
 * @global
 */
var Client = {};

/**
 * Add Client Event Listeners.
 * 
 * @param {String} name of client
 */
function addListeners(name)
{
    Client[name].on('ready', (evt) => 
    {
        logger.info(`Logged in as ${Client[name].user}`);
    });
    Client[name].on('disconnect', e =>
    {
        logger.info(`Client ${Client[name].user} has disconnected. Please restart.`);
        logger.error(e);
    });
}

/**
 * Initialize Client.
 * 
 * @param {String} name of client
 */
function init(name)
{
    if(typeof(name) == "string")
    {
        Client[name] = new Bot(auth.token[name]);
        addListeners(name);
    }
}

/**
 * Kill Client.
 * 
 * @param {String} name of client
 */
function kill(name)
{
    Client[name].destroy();
    delete Client[name];
}

/**
 * Process Exit Event Listener
 * 
 * @listens exit
 */
process.on('exit', (code) =>
{
    logger.info(`Exited with code: ${code}`);
});

process.on('uncaughtException', e =>
{
    console.log(e);
});

/**
 * STDIN Readable Event Listener
 * 
 * @listens readable Console input listener. Host may interact with the bot app behind
 * the scenes and instantiate multiple bot clients.
 */
process.stdin.on('readable', () =>
{
    let input;
    while((input = process.stdin.read()) !== null)
    {
        let regx = /(\w+)\s?(\w+)?\s?(.+)?/;
        let args = regx.exec(input.toString());
        if(args !== null)
        {
            args = args.slice(1,4);
            switch(args[0])
            {
                case "init":
                if(!Client[args[1]])
                    init(args[1]);
                break;

                case "kill":
                if(Client[args[1]])
                    kill(args[1]);
                break;

                case "restart":
                if(Client[args[1]])
                {
                    kill(args[1]);
                    init(args[1]);
                }
                break;

                case "add":
                if(!auth.token[args[1]])
                {
                    auth.token[args[1]] = args[2];
                    fs.writeFile("./auth.json", JSON.stringify(auth, null, 4), (err) =>
                    {
                        if(err) throw err;
                        logger.info('Successfully added token');
                    });
                }
                break;

                case "del":
                if(auth.token[args[1]])
                {
                    delete auth.token[args[1]];
                    fs.writeFile("./auth.json", JSON.stringify(auth, null, 4), (err) =>
                    {
                        if(err) throw err;
                        logger.info('Successfully deleted token');
                    });
                }
                break;

                case "mem":
                logger.info(process.memoryUsage());
                break;

                case "exit":
                process.exit(0);
            }
        }
    }
});

logger.info("Enter a command..");
init("test");
