/**
 * Structures for use in bot modules.
 * 
 * @author ch1pset
 * @file Contains structures for modules.
 * @class
 * 
 * @since 2019-5-4
 * @version 2019.5.4
 */

const fs = require('fs')
const Discord = require('discord.js')
const util = require('./utils.js')
const PERMISSION = Discord.Permissions.FLAGS;

exports.Dictionary = class Dictionary
{
    /**
     * Dictionary constructor
     * 
     * @constructor
     */
    constructor(){}

    /**
     * Getter to copy Dictionary object into an array of values.
     * Keys are discarded.
     * 
     * @public
     * @method
     * @returns {this[string][]}
     */
    get array()
    {
        let arr = [];
        for(let key in this)
        {
            arr.push(this[key]);
        }
        return arr;
    }

    /**
     * Getter for counting number of elements in Dictionary
     * 
     * @public
     * @method
     * @returns {number}
     */
    get size()
    {
        let count = 0;
        for(let key in this) count++;
        return count;
    }

    /**
     * Function for adding or updating an entry in the Dictionary.
     * 
     * @method
     * @public
     * @param {string} key Must be of type string.
     * @param {*} value May be any type.
     */
    set(key, value)
    {
        this[key.toLowerCase()] = value;
    }

    add(keyArray, callback)
    {
        for(let key in keyArray)
        {
            if(!this.has(key))
                this.set(key, callback());
        }
    }

    /**
     * Function for retrieving an entry from the Dictionary
     * 
     * @method
     * @public
     * @param {string} key 
     */
    get(key)
    {
        return this[key.toLowerCase()];
    }

    /**
     * Function for checking existence of an entry in the Dictionary
     * 
     * @method
     * @public
     * @param {string} key 
     */
    has(key)
    {
        return this[key.toLowerCase()]? true : false;
    }
    
    /**
     * Function for deleting an entry in the Dictionary
     * 
     * @method
     * @public
     * 
     * @param {string} key Must be of type string.
     */
    delete(key)
    {
        delete this[key.toLowerCase()];
    }

    deleteSelect(keyArray)
    {
        for(let key in keyArray)
        {
            delete this[key.toLowerCase()];
        }
    }

    remove(callback)
    {
        for(let key in this)
        {
            if(callback(this[key], key)){
                let output = this[key];
                delete this[key];
                return output;
            }
        }
        return null;
    }

    removeSelect(keyArray, callback)
    {
        let output = [];
        for(let key in keyArray)
        {
            if(this.has(key) && callback(this.get(key), key))
            {
                output.push(this.get(key));
                delete this[key.toLowerCase()];
            }
        }
        return output;
    }

    /**
     * For each loop works like Array.forEach
     * 
     * @method
     * @public
     * @param {function(any, string)} callback 
     */
    forEach(callback)
    {
        for(let key in this)
        {
            callback(this[key], key);
        }
    }

    /**
     * @param {string[]} keyArray 
     * @param {function(any, string)} callback 
     */
    forSelect(keyArray, callback)
    {
        for(let key in keyArray)
        {
            if(this.has(key))
                callback(this.get(key), key);
        }
    }

    /**
     * @param {string[]} keyArray 
     * @param {function(any, string)} callback 
     */
    find(callback)
    {
        for(let key in this)
        {
            if(callback(this[key], key))
                return this[key];
        }
        return null;
    }

    /**
     * @param {string[]} keyArray 
     * @param {function(any, string)} callback
     * @returns {any[]}
     */
    filter(callback)
    {
        let output = [];
        for(let key in this)
        {
            if(callback(this[key], key))
                output.push(this[key]);
        }
        return output;
    }

    /**
     * @param {string[]} keyArray 
     * @param {function(any, string)} callback 
     */
    filterSelect(keyArray, callback)
    {
        let output = [];
        for(let key in keyArray)
        {
            if(this.has(key) && callback(this.get(key), key))
                output.push(this.get(key));
        }
    }

    /**
     * @param {string[]} keyArray 
     * @param {function(any, string)} callback 
     */
    map(callback)
    {
        let output = [];
        for(let key in this)
        {
            output.push(callback(this[key], key));
        }
        return output;
    }

    /**
     * @param {string[]} keyArray 
     * @param {function(any, string)} callback 
     */
    mapSelect(keyArray, callback)
    {
        let output = [];
        for(let key in keyArray)
        {
            if(this.has(key))
                output.push(callback? callback(this.get(key), key) : this.get(key));
        }
        return output;
    }

    /**
     * Function for writing Dictionary to file.
     * 
     * Asynchronously writes the contents of `this` to a specified file path.
     * 
     * @method
     * @public
     * @param {string} fname 
     */
    writeToFile(fname)
    {
        console.log(`Writing to ${fname}`);
        fs.createWriteStream(fname).write(JSON.stringify(this, null, 4), (err) =>
        {
            if(err) console.log(err);
        });
    }

    /**
     * Static function for creating a Dictionary from a file.
     * 
     * @method 
     * @static
     * @public
     * @param {string} fname 
     * The file path.
     * @param {*} type 
     * The type that values will be stored as. Default is whatever is in the file.
     */
    static fromJSON(fname, type)
    {
        let Dict = new Dictionary();
        let File = require(fname);
        if(File)
        {
            for(let i in File)
            {
                Dict[i] = type?
                    new type(File[i]) 
                    : File[i];
            }
            return Dict;
        }
        else
        {
            console.error('No data in file.');
            return Dict;
        }
    }
}

exports.User = class UserData
{
    constructor(msg)
    {
        this.name = msg.author.username;
        this.id = msg.author.id;
        this.roles = msg.member? msg.member.roles : null;
        this.permissions = msg.member? msg.member.permissions.bitfield : 0x0;
    }
    get isAdmin()
    {
        return (this.permissions & PERMISSION.ADMINISTRATOR === PERMISSION.ADMINISTRATOR);
    }
    get isMod()
    {
        let mod = PERMISSION.BAN_MEMBERS | PERMISSION.KICK_MEMBERS;
        return (this.permissions & mod === mod);
    }
    hasRole(role)
    {
        return this.roles? this.roles.some(r => r.name === role) : false;
    }
    hasPermission(permissions)
    {
        return (this.permissions & permissions) === permissions;
    }
}

exports.Channel = class ChannelData
{
    constructor(msg)
    {
        this.name = msg.channel.name? msg.channel.name : "";
        this.type = msg.channel.type;
        this.id = msg.channel.id;
    }
    get isDM()
    {
        return this.type === 'dm';
    }
    get isText()
    {
        return this.type === 'text';
    }
    get isGroup()
    {
        return this.type === 'group';
    }
}

exports.Message = class MessageData
{
    constructor(msg)
    {
        this.id = msg.id;
        this.content = msg.content;
        this.author = msg.author.username;
        this.channel = msg.channel.name;
    }
}


/**
 * Link struct holds all the properties of a link to be stored in the database.
 * 
 * @class
 */
exports.Link = class Link
{
    constructor({name, op, url, tags, date = util.Date()})
    {
        /**
         * Name of link
         * @type {string}
         * @property
         */
        this.name = name;
        /**
         * Original Poster of link
         * @type {string}
         * @property
         */
        this.op = op;
        /**
         * URL
         * @type {string}
         * @property
         */
        this.url = url;
        /**
         * Search tags
         * @type {string[]}
         * @property
         */
        this.tags = tags;
        /**
         * Date of posting
         * @type {string}
         * @property
         */
        this.date = date;
    }
    delTags(list)
    {
        let indx;
        for(let t of list)
            if((indx = this.tags.indexOf(t.toLowerCase())) !== -1)
                this.tags.splice(indx, 1);
    }
    addTags(list)
    {
        for(let t of list)
        {
            if(!this.tags.includes(t.toLowerCase()))
                this.tags.push(t.toLowerCase());
        }
    }
    toString()
    {
        let output = `[${this.name}]`;
        output += `(${this.url})`;
        output += `\nPosted by ${this.op} on ${this.date}`;
        output += `\ntags: ${this.tags.join(', ')}`;
        return output;
    }
}

/**
 * Tag struct is just an array of strings.
 * 
 * @class
 */
exports.Tag = class Tag extends Array
{
    constructor(dat)
    {
        super();
        for(let l in dat)
            this.push(dat[l].toLowerCase());
    }
    delLink(name)
    {
        let i = this.indexOf(name.toLowerCase());
        if(i !== -1) this.splice(i, 1);
        return this.length;
    }
    addLink(name)
    {
        if(!this.includes(name.toLowerCase()))
            return this.push(name.toLowerCase());
        else
            return this[this.indexOf(name.toLowerCase())]
    }
}
