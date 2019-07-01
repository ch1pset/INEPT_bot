import { Decorator, fn, bool } from "./typedefs";

/**
 * Logs specified formatted method output to console
 */
export function Log(format: string): Decorator<any> {
    return function(target, key, method) {
        const origin = method.value;
        method.value = function(...args: any[]) {
            const result = JSON.stringify(origin.apply(target, args), null, 2);
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
                ret = origin.apply(target, args);
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

export function Mixins(mixins: fn[]): fn {
    return function(ctor: fn) {
        mixins.forEach(mixin => {
            const proto = Object.getOwnPropertyDescriptors(mixin.prototype);
            for(let name in proto) {
                Object.defineProperty(ctor.prototype, name, proto[name]);
            }
        });
    }
}
