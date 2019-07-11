import { Decorator, fn, bool } from "./typedefs";
import { SingletonInstantiationError } from "./errors";
import { Logger } from "../services/logger.service";

/**
 * Logs specified formatted method output to console
 */
export function Log(format: string): Decorator<any> {
    return function(target, key, method) {
        const origin = method.value;
        method.value = function(...args: any[]) {
            const result = JSON.stringify(origin.apply(target, ...args), null, 2);
            console.log(format ? format.replace(/%\([ndsf]\)|\$\([\w]+\)/ig, result) : result);
        };
        return method;
    }
}

export function TryCatch(options?: { nolog?: bool, callback?: (e?: Error) => void }): Decorator<any> {
    return function(target, key, method) {
        const origin = method.value;
        method.value = function(...args: any[]) {
            let ret;
            try {
                ret = origin.apply(target, ...args);
            } catch(e) {
                if(!options || !options.nolog) {
                    console.error(`Error detected in ${String(key)} from ${target}`);
                    console.error(`Triggered by ${origin}`);
                    console.error(e);
                }

                if(options && options.callback) {
                    options.callback(e);
                }
                ret = null;
            }
            return ret;
        }
        return method;
    }
}

export function Mixin(mixins?: fn[]): fn {
    return function(ctor: fn) {
        if(mixins) {
            mixins.forEach(mixin => {
                Logger.default.info(`Applying mixin ${mixin.name} to ${ctor.name}...`);
                const proto = Object.getOwnPropertyDescriptors(mixin.prototype);
                for(let name in proto) {
                    Object.defineProperty(ctor.prototype, name, proto[name]);
                }
            });
        }
    }
}

export function Singleton(...decArgs: any[]) {
    return function<T extends {new(...args:any[]):{}}>(ctor: T) {
        return class Singleton extends ctor {
            private static _self: ThisType<T>;
            private constructor(...ctorArgs: any[]) {
                super();
                throw new SingletonInstantiationError(ctor);
            }
            static get self() {
                if(!Singleton._self) {
                    Singleton._self = new ctor(...decArgs);
                    Logger.default.info('Singleton instantiated: ' + ctor.name);
                }
                return Singleton._self;
            }
        }
    }
}

// export function Factory() {
//     return function<T extends {new(...args: any[]):{}}>(ctor: T) {
//         return class extends ctor {
//             private constructor(...args: any[]) {
//                 super(...args);
//             }
//             static create(...args: any[]) {
//                 return new ctor(...args);
//             }
//             static copy(other: T) {
//                 const copy_T = {};
//                 Object.assign(copy_T, other);
//                 return copy_T;
//             }
//         }
//     }
// }