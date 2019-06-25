"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const sstream_1 = require("./sstream");
/**
 * Readonly decorator freezes a property of an object.
 * Useful for defining immutable properties.
 */
function Readonly(initializer) {
    return function (target, key) {
        target[key] = initializer;
        (typeof initializer === 'object') ?
            Object.freeze(target[key]) :
            Object.defineProperty(target, key, {
                value: initializer,
                writable: false,
                configurable: false
            });
    };
}
exports.Readonly = Readonly;
/**
 * Logs specified formatted message to console, injecting the result of
 * the function applied
 */
function LogResult(format) {
    return function (target, key, descriptor) {
        const origin = descriptor.value;
        descriptor.value = function (...args) {
            const result = JSON.stringify(origin.apply(this, args), null, 2);
            console.log(format ? format.replace(/%[ndsf]|\$[\w]+/ig, result) : result);
        };
        return descriptor;
    };
}
exports.LogResult = LogResult;
function TryCatch(options) {
    return function (target, key, descriptor) {
        const origin = descriptor.value;
        descriptor.value = function (...args) {
            let ret;
            try {
                ret = origin.apply(this, args);
            }
            catch (e) {
                if (options.log) {
                    console.error(`Error detected in ${String(key)} from ${target}`);
                    console.error(`Triggered by ${origin}`);
                }
                if (options.stack)
                    console.error(e);
                if (options.callback) {
                    options.callback(e, ...args);
                }
                ret = null;
            }
            return ret;
        };
        return descriptor;
    };
}
exports.TryCatch = TryCatch;
function Promisify(target, key, descriptor) {
    const origin = descriptor.value;
    descriptor.value = function (...args) {
        return new Promise((res, rej) => {
            const callback = (err, data) => err ? rej(err) : res(data);
            origin.apply(this, [...args, callback]);
        });
    };
    return descriptor;
}
exports.Promisify = Promisify;
const _GLOBAL_EVENTS = {};
function Listen(event) {
    return function (target, key, descriptor) {
        const origin = descriptor.value;
        descriptor.value = function (callback) {
            if (_GLOBAL_EVENTS[event])
                _GLOBAL_EVENTS[event].push(callback);
            else
                _GLOBAL_EVENTS[event] = [callback];
            origin.apply(this, callback);
        };
        return descriptor;
    };
}
exports.Listen = Listen;
function Fire(event) {
    return function (target, key, descriptor) {
        const origin = descriptor.value;
        descriptor.value = function (...args) {
            origin.apply(this, args);
            _GLOBAL_EVENTS[event].forEach(call => call(...args));
        };
        return descriptor;
    };
}
exports.Fire = Fire;
const event = 'end';
class API {
    static GET(request, callback) {
        let buffer = new sstream_1.StringWritable();
        https_1.get(request, res => res.pipe(buffer)
            .on('finish', () => callback ? callback(undefined, buffer) : null)
            .on('error', err => callback ? callback(err, undefined) : null));
        return buffer;
    }
    static register(callback) {
        console.log(`Registered callback to global event ${event}`);
    }
    static fireEvent(...args) {
        API.constant = null;
        console.log(`Global event ${event} fired`);
    }
}
__decorate([
    Readonly('hello')
], API, "constant", void 0);
__decorate([
    TryCatch({ log: true }),
    Promisify
], API, "GET", null);
__decorate([
    TryCatch({ log: true }),
    Listen(event)
], API, "register", null);
__decorate([
    TryCatch({ stack: true }),
    Fire(event)
], API, "fireEvent", null);
API.register((input) => console.log('1st listener: ' + input));
API.register((input) => console.log('2nd listener: ' + input));
var tick = 0;
setInterval(() => {
    tick = ~tick;
    API.fireEvent('FIRE', tick === 0);
}, 1000);
