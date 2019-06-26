import { Decorator, fn, bool } from "./types";

/**
 * Logs specified formatted message to console, injecting the result of
 * the function applied
 */
export function Log(format: string): Decorator<fn> {
    return function(target, key, method) {
        const origin = method.value;
        method.value = function(...args: any[]) {
            const result = JSON.stringify(origin.apply(this, args), null, 2);
            console.log(format ? format.replace(/%[ndsf]|\$[\w]+/ig, result) : result);
        };
        return method;
    }
}

export function TryCatch(options?: { nolog?: bool, callback?: fn }): Decorator<any> {
    return function(target, key, method) {
        const origin = method.value;
        method.value = function(...args: any[]) {
            let ret;
            try {
                ret = origin.apply(this, args);
            } catch(e) {
                if(!options.nolog) {
                    console.error(`Error detected in ${String(key)} from ${target}`);
                    console.error(`Triggered by ${origin}`);
                    console.error(e);
                }

                if(options.callback) {
                    options.callback(e, args);
                }
                ret = null;
            }
            return ret;
        }
        return method;
    }
}

export const Promisify: Decorator<fn> = (target, key, method) => {
    const origin = method.value;
    method.value = function(...args: any[]) {
        return new Promise((res, rej) => {
            const callback = (err: Error, data: any) => err ? rej(err) : res(data);
            origin.apply(this, [...args, callback]);
        });
    }
    return method;
}
