import { Decorator, fn, bool, NodeCallback, Constructor } from "../typedefs";
import { RUN, MODE } from "../../config";

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