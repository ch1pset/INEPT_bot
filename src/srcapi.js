
const stream = require('stream');
const https = require('https');

/**
 * Promisifies https.get() function
 * 
 * @param {(string | SRCreq | URL)} request 
 */
function GET(request)
{
    return new Promise((res, rej) =>{
        https.get(request, response => {
            let raw = new stream.Writable();
            response.setEncoding('utf8');
            response.on('data', dat => raw += dat);
            response.on('end', () => {
                try {
                    res(JSON.parse(raw).data);
                } catch(e) {
                    rej(e)
                }
            });
        });
    });
}

/**
 * Request options for SRCapi
 * 
 * @class
 */
class SRCreq
{
    constructor(path)
    {
        this.hostname = "www.speedrun.com";
        this.path = `/api/v1${path? path : ''}`;
        this.headers = {
            "Content-Type":"application/json",
            "User-Agent":"INEPT_bot/0.1.a"
        }
    }
}

/**
 * SRC Variable structure
 * 
 * @class
 */
class VARIABLE 
{
    constructor(v)
    {
        this.id = v.id;
        this.name = v.name;
        this.scope = v.scope.type;
        this.values = v.values.values;
    }
    get VALUES()
    {
        let out = [];
        for(let id in this.values)
        {
            out.push([this.values[id].label, id]);
        }
        return out;
    }
    getValueID(label)
    {
        return this.VALUES.find(v => v[0] === label)[1];
    }
}

/**
 * SRC Category structure
 * 
 * @class
 */
class CATEGORY 
{
    constructor(c)
    {
        this.id = c.id;
        this.name = c.name;
        this.weblink = c.weblink;
        this.rules = c.rules;
        this.variables = c.variables? c.variables.data.map(v => new VARIABLE(v)) : null;
    }
    getVariableIDs(name, value)
    {
        let ret = this.variables.find(v => v.name === name);
        return ret? [ret.id, ret.getValueID(value)] : [,];
    }
}

class LEVEL
{
    constructor(l)
    {
        this.id = l.id;
        this.name = l.name;
        this.weblink = l.weblink;
        this.rules = l.rules;
        this.categories = l.categories? l.categories.data.map(c => new CATEGORY(c)) : null;
        this.variables = l.variables? l.variables.data.map(v => new VARIABLE(v)) : null;
    }
    getVariableIDs(name, value)
    {
        let ret = this.variables.find(v => v.name === name);
        return ret? [ret.id, ret.getValueID(value)] : [,];
    }
}

/**
 * SRC Game structure
 * 
 * @class
 */
class GAME 
{
    constructor(g)
    {
        this.id = g.id;
        this.abbreviation = g.abbreviation;
        this.name = g.names.international;
        this.weblink = g.weblink;
        this.categories = g.categories? g.categories.data.map(c => new CATEGORY(c)) : null;
        this.variables = g.variables? g.variables.data.map(v => new VARIABLE(v)) : null;
        this.levels = g.levels? g.levels.data.map(l => new LEVEL(l)) : null;
    }
    /**
     * 
     * @param {string} name
     * @param {string} value
     * @returns {Number[]}
     */
    getVariableIDs(name, value)
    {
        let ret = this.variables.find(v => v.name === name);
        return ret? [ret.id, ret.getValueID(value)] : [,];
    }
    /**
     * 
     * @param {string} name 
     * @returns {CATEGORY}
     */
    getCategory(name)
    {
        return this.categories.find(c => c.name === name);
    }
    /**
     * 
     * @param {string} name 
     * @returns {LEVEL}
     */
    getLevel(name)
    {
        return this.levels.find(l => l.name === name);
    }
}


/**
 * Sends speedrun.com a search request for the game with the given abbreviation
 * 
 * @param {string} abrv 
 */
function getGame(abrv, embeds)
{

    return GET(new SRCreq(`/games?abbreviation=${abrv}&embed=${embeds.join(',')}`)).then(games => new GAME(games[0]));
}

/**
 * Sends speedrun.com a search request for the user with the given username
 * by lookup, which returns an exact match
 * 
 * @param {string} name 
 */
function getUser(name)
{
    return GET(new SRCreq(`/users?lookup=${name}`)).then(users => users[0]);
}

/**
 * Sends speedrun.com a search request for game associated with given abbreviation,
 * then sends another request with proper url for specified leaderboard
 * 
 * @param {string} abrv Game abbreviation
 * @param {string} cat Leaderboard category
 * @param {[string[]]} [vars] Filter variables
 * @param {string} [lvl] Leaderboard level
 */
async function getLeaderboard(abrv, cat, vars, lvl)// [["Tonics","No Tonics"],["Platform Route","Console"]]
{
    let game = await getGame(abrv, ['levels.variables','categories.variables','variables']);
    let category = game.categories.find(c => c.name === cat);
    let variables = game.variables;
    let level = game.levels.find(l => l.name === lvl);
    let query = "";
    if(vars) vars.forEach(v => {
            let variable = variables.find(va => va.name === v[0]);
            query += `var-${variable.id}=${variable.getValueID(v[1])}&`;
        });
    return GET(new SRCreq(`/leaderboards/${game.id}${level? `/level/${level.id}/` : `/category/`}${category.id}?${query}`));
}

/**
 * Sends speedrun.com a search request for game associated with given abbreviation,
 * then sends another request with proper url for specified leaderboard
 * 
 * @param {string} abrv Game abbreviation
 * @param {string} cat Leaderboard category
 * @param {[string[]]} [vars] Filter variables
 * @param {string} [lvl] Leaderboard level
 */
async function getLeader(abrv, cat, vars, lvl)
{
    let game = await getGame(abrv, ['levels.variables', 'categories.variables']);
    let category = game.getCategory(cat);
    let level = game.getLevel(lvl);
    let query = "";

    if(vars) vars.forEach(v => {
        let catvars = category.getVariableIDs(v[0], v[1]);
        if(catvars) {
            query += `var-${catvars[0]}=${catvars[1]}&`;
        }
        // let lvlvars = level.getVariableIDs(v[0], v[1]);
        // if(lvlvars) {
        //     query += `var-${lvlvars[0]}=${lvlvars[1]}&`;
        // }
    });
    return GET(new SRCreq(`/leaderboards/${game.id}${level? `/level/${level.id}/` : `/category/`}${category.id}?${query}`));
}

module.exports = {
    game:getGame,
    user:getUser,
    leaderboard:getLeader
}
