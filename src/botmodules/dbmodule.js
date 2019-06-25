
const Discord = require('discord.js');
const PERMISSION = Discord.Permissions.FLAGS;

const util = require('./utils.js');
const Struct = require('./structures.js');
const BotModule = require('./default.js');


module.exports = class LinksModule extends BotModule
{
    constructor()
    {
        super();
        this.ROLES = ["Mods", "Runners", "Community-Dev", "Dev", "Testers"];
        this.PERMISSIONS = PERMISSION.BAN_MEMBERS | PERMISSION.KICK_MEMBERS;
        this.linksDB = Struct.Dictionary.fromJSON('../links.json', Struct.Link);
        this.tagsDB = Struct.Dictionary.fromJSON('../tags.json', Struct.Tag);
    }
    updateDB()
    {
        this.linksDB.writeToFile('./links.json');
        this.tagsDB.writeToFile('./tags.json');
    }
    addLink(name,url,tags,op)
    {
        let l = new Struct.Link({name,op,url,tags});
        l.name.split(' ').forEach(t => {
            if(!l.tags.includes(t))
                l.tags.push(t);
        });
        this.linksDB.set(l.name, l);
        l.tags.forEach(t => {
            this.tagsDB.has(t)
                ? this.tagsDB.get(t).addLink(l.name)
                : this.tagsDB.set(t, new Struct.Tag([l.name]));
        });
        this.updateDB();
        return l;
    }
    delLink(name)
    {
        this.linksDB.get(name).tags.forEach(t => {
            let size = this.tagsDB.get(t).delLink(name);
            if(size === 0) this.tagsDB.delete(t);
        });
        this.linksDB.delete(name);
        this.updateDB();
    }
    find(tags)
    {
        let output;
        this.tagsDB.forSelect(tags, (links) => {
            output = this.linksDB.mapSelect(links, link => link.toString());
        });
        return output;
    }
    strictSearch(tags)
    {
        let output = [];
        output = this.linksDB.filter(l => l.tags.every(t => tags.includes(t)));
        return output.map(l => l.toString());
    }
    execute(args, msg, respond)
    {
        let {TYPE="dm", MESSAGE=""};
        let user = new Struct.User(msg);
        let channel = new Struct.Channel(msg);
        let output;
        switch(args.opt)
        {
            case "add":
            case "new":
                if(channel.isText && this.checkPermissions(user))
                {
                    if(args.url && args.text[0])
                    {
                        if(!this.linksDB.has(args.text[0])) //added
                        {
                            MESSAGE = "Added link to database\n";
                            this.addLink(args.text[0], args.url, args.list, user.name);
                        }
                        else if(user.name === this.linksDB.get(args.text[0]).op || user.isAdmin || user.isMod) //overwrite
                        {
                            this.addLink(args.text[0], args.url, args.list, user.name);
                            MESSAGE = "Link overwritten!";
                        }
                        else MESSAGE = `Only OPs can overwrite their own links. Ask ${this.linksDB.get(args.text[0]).op} to update their link.`;
                    }
                    else 
                    {
                        MESSAGE = "```md\n";
                        MESSAGE += "To add links:\n";
                        MESSAGE += "+ URLs must begin with http:// or https://\n";
                        MESSAGE += "+ The name of your link must be inside \"\"\n";
                        MESSAGE += "+ Tags are optional and separated by spaces, more is better\n";
                        MESSAGE += "+ Fields may be entered in any order\n";
                        MESSAGE += "**Example**\n";
                        MESSAGE += "# !link-add https://example.com \"link example\" you can optionally add tags separated by spaces\n";
                        MESSAGE += "```";
                        TYPE = "dm";
                    }
                }
                else MESSAGE = "You don't have permission to use this command in this channel.";
                break;
            case "del":
            case "delete":
            case "rem":
            case "remove":
                if(channel.isText && this.checkPermissions(user))
                {
                    if(this.linksDB.has(args.text[0]))
                    {
                        if(this.linksDB.get(args.text[0]).op === user.name || user.isAdmin)
                        {
                            this.delLink(args.text[0]);
                            MESSAGE = "Link deleted!"
                        }
                        else MESSAGE = "Only OPs can delete their own links.";
                    }
                    else MESSAGE = "Link not found."
                }
                else MESSAGE = "You don't have permission to use this command in this channel.";
                break;
            case "find":
            case "search":
            case "f":
            case "s":
                output = this.find(args.list);
                if(output.length > 0)
                {
                    if(output.length < 50)
                        MESSAGE = output.join('\n');
                    else
                        MESSAGE = "";
                }
                else MESSAGE = "No links found.";
                TYPE = "dm";
                break;
            case "findstrict":
            case "searchstrict":
            case "strictfind":
            case "strictsearch":
                output = this.strictSearch(args.list.map(t => t.toLowerCase()));
                if(output.length > 0)
                {
                    if(output.length < 50)
                        MESSAGE = output.join('\n');
                    else
                        MESSAGE = "";
                }
                else MESSAGE = "No links found.";
                TYPE = "dm";
                break;
            case "help":
            case "h":
                MESSAGE = "```md\n";
                MESSAGE += "The !link command module may use the following options:\n\n";
                MESSAGE += "-add        : Lets authorized users add new links to the database.\n";
                MESSAGE += "-del        : Lets authorized users delete their own links.\n";
                MESSAGE += "-find       : Search the database for links with ANY of the specified tags.\n";
                MESSAGE += "-strictfind : Search database for links with ALL of the specified tags.\n";
                MESSAGE += "-get        : Retrieves the link with name, not case sensitive.\n";
                MESSAGE += "-help       : Displays this info.\n";
                MESSAGE += "```";
                TYPE = "dm";
                break;
            case "get":
            default:
                let l = this.linksDB.get(args.text[0]);
                if(l) MESSAGE = l.toString();
                else MESSAGE = "That link doesn't exist!";
                break;
        }
        respond({TYPE, MESSAGE});
    }
}