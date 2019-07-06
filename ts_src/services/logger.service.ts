import { Console } from 'console';
import { Singleton, str, bool } from "../utils";
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
        return (new Date(Date.now())).toISOString();
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
        const output = `${this.time} ${this.level}`
            + this.error ? `\n${this.error}` :
              `${this.message}\n` + this.stack;
        return output;
    }
}

export class Logger extends Console {
    constructor(opt: {stdout: Writable, stderr?: Writable, colorMode?: bool}) {
        super(opt);
    }
    
    info(message: str) {
        this.log(Log.create(LogLevel.INFO, {message}));
    }

    debug(message: str, stack: str) {
        this.log(Log.create(LogLevel.DEBUG, {message, stack}));
    }

    warn(message: str) {
        this.log(Log.create(LogLevel.WARN, {message}));
    }

    eror(error: Error) {
        this.error(Log.create(LogLevel.EROR, {error}));
    }

    fatal(error: Error) {
        this.error(Log.create(LogLevel.FATAL, {error}));
    }
}
