import { Console } from 'console';
import { str, bool } from "../utils/typedefs";
import { Writable } from 'stream';

enum LogLevel {
    ALL = 'ALL',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    WARN = 'WARN',
    EROR = 'EROR',
    FATAL = 'FATAL',
}

interface ILog {
    level: LogLevel;
    time: str;
    error?: Error;
    message?: str;
    stack?: str;
}

export class Log implements ILog {
    level: LogLevel;
    time: str;
    error?: Error;
    message?: str;
    stack?: str;
    private constructor(info: ILog) {
        Object.assign(this, info);
    }
    static get timestamp() {
        return (new Date(Date.now())).toISOString().replace(/[a-zA-Z]/, ' ');
    }
    static create(level: LogLevel, info: {error?: Error, message?: str, stack?: str}): Log {
        return new Log({
            level,
            time: Log.timestamp,
            error: info.error,
            message: info.message,
            stack: info.stack
        });
    }
    toString(): str {
        let output = `${this.time} ${this.level}: `;
        output += this.error ? 
            `${this.error}` :
            (`${this.message}` + (this.stack ? '\n' + this.stack : ''));
        return output;
    }
}

export class Logger extends Console {
    private static _default = new Logger({stdout: process.stdout, colorMode: true});
    constructor(opt: {stdout: Writable, stderr?: Writable, colorMode?: bool}) {
        super(opt);
    }
    static get default() {
        return this._default;
    }
    info(message: str) {
        const urlMatch = message.match(/(https?:\/\/[^ "<>\\^`{|}\s]{1,500})/);
        if(urlMatch) message = message.replace(urlMatch[1], `<${urlMatch[0]}>`);
        this.log(Log.create(LogLevel.INFO, {message}).toString());
    }

    debug(message: str, stack?: str) {
        this.log(Log.create(LogLevel.DEBUG, {message, stack}).toString());
    }

    warn(message: str) {
        this.log(Log.create(LogLevel.WARN, {message}).toString());
    }

    eror(error: Error) {
        this.error(Log.create(LogLevel.EROR, {error}).toString());
    }

    fatal(error: Error) {
        this.error(Log.create(LogLevel.FATAL, {error}).toString());
    }
}
