import { Singleton } from "../utils/decorators";
import { str } from "../utils/typedefs";

enum LogLevel {
    ALL = 'ALL',
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL'
}

interface Log {
    level: LogLevel;
    timestamp: str;
    message: str;
    stack: str;
}

@Singleton()
export class Logger {
    static self: Logger;
    
}
