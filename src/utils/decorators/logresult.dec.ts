import { Decorator } from "../typedefs";
import { RUN, MODE } from "../../config";

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