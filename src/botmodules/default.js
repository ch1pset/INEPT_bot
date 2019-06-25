const fs = require('fs');
const Discord = require('discord.js');
const PERMISSION = Discord.Permissions.FLAGS;

const util = require('./utils.js');
const srcapi = require('./srcapi.js');
const Struct = require('./structures.js');



module.exports = class BotModule
{
    constructor(name)
    {
        this.NAME = name;
        this.ROLES = [];
        this.PERMISSIONS = 0x0;
    }
    checkPermissions(user)
    {
        return this.ROLES.some(r => user.hasRole(r)) || user.hasPermission(this.PERMISSIONS);
    }
    execute()
    {
        throw new Error("Execute function must be implemented.");
    }
    get config()
    {
        return fs.readFileSync(`./config/botmodules/${this.NAME}`);
    }
    get MESSAGES()
    {
        return this.config.MESSAGES;
    }
    get PERMISSIONS()
    {
        return this.config.PERMISSIONS;
    }
}