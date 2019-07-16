import { Decorator, fn, bool, NodeCallback, Constructor } from "./typedefs";
import { Logger } from "../services";
import { RUN, MODE } from "../config";

/**
 * Logs specified formatted method output to console
 */
export function LogResult(format?: string): Decorator<any> {
    return function(target, key, method) {
        if(RUN.MODE === MODE.DEBUG) {
            const origin = method.value;
            method.value = function(...args: any[]) {
                const result = origin.apply(this, args);
                const output = JSON.stringify(result, null, 2);
                console.log(format ? 
                    format.replace(/%\([ndsf]\)|\$\([\w]+\)/ig, output) 
                    : output);
                return result;
            };
        }
        return method;
    }
}

export function TryCatch(options?: { nolog?: bool, callback?: NodeCallback<Error, any>}): Decorator<any> {
    return function(target, key, method) {
        if(RUN.MODE === MODE.DEBUG) {
            const origin = method.value;
            method.value = function(...args: any[]) {
                let ret: any;
                try {
                    ret = origin.apply(this, args);

                    if(options && options.callback) {
                        options.callback(null, ret ? ret : {});
                    }
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

// export function Singleton(...decArgs: any[]) {
//     return function<T extends {new(...args: any[]):{}}>(ctor: T) {
//         return class Singleton extends ctor {
//             private static _self: ThisType<T>;
//             private constructor(...ctorArgs: any[]) {
//                 super();
//                 throw new SingletonInstantiationError(ctor);
//             }
//             static get self() {
//                 if(!Singleton._self) {
//                     Singleton._self = new ctor(...decArgs);
//                     Logger.default.info('Singleton instantiated: ' + ctor.name);
//                 }
//                 return Singleton._self;
//             }
//         }
//     }
// }

// export function Factory() {
//     return function<T extends Constructor>(ctor: T) {
//         return class extends ctor {
//             private constructor(...args: any[]) {
//                 super(...args);
//             }
//             static create(...args: any[]) {
//                 return new ctor(...args);
//             }
//             static copy(other: T) {
//                 if(other) {
//                     const copy_T = new ctor();
//                     Object.assign(copy_T, other);
//                     return copy_T;
//                 } else return null;
//             }
//         }
//     }
// }
