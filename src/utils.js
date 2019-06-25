
const {Console} = require('console');

exports.Date = function date(now)
{
    now = now? now : new Date(Date.now());
    let t_str = t => t.toString().padStart(2,'0');
    let yyyy = now.getFullYear();
    let mm = t_str(now.getMonth() + 1);
    let dd = t_str(now.getDate());
    return `${yyyy}-${mm}-${dd}`;
}

exports.Time = function time(now)
{
    now = now? now : new Date(Date.now());
    let t_str = t => t.toString().padStart(2,'0');
    let hh = t_str(now.getHours());
    let mm = t_str(now.getMinutes());
    let ss = t_str(now.getSeconds());
    return `${hh}:${mm}:${ss}`;
}

exports.Timestamp = function timestamp()
{
    let now = new Date(Date.now());
    return `${date(now)} ${time(now)}`;
}

exports.Timer = class Timer
{
    constructor()
    {
        this.time = [0,0];
        this.active = false;
    }
    get seconds()
    {
        return this.time[0];
    }
    get nano()
    {
        return this.time[1];
    }
    start()
    {
        if(!this.active)
        {
            this.time = process.hrtime();
            this.active = true;
        }
    }
    stop()
    {
        if(this.active)
        {
            this.time = process.hrtime(this.time);
            this.active = false;
        }
    }
}

exports.Logger = class Logger extends Console
{
    constructor(settings)
    {
        super(settings);
    }
    info(output)
    {
        this.log(`${timestamp()} ${output}`);
    }
    err(output)
    {
        this.error(`${timestamp()} ${output}`);
    }
}