
/**
 * Readonly decorator freezes a property of an object.
 * Useful for defining immutable properties.
 */
export function Readonly(initializer: any) {
    return function(target: Object, key: PropertyKey) {
        target[key] = initializer;
        (typeof initializer === 'object') ? 
            Object.freeze(target[key]) :
            Object.defineProperty(target, key, {
                value: initializer,
                writable: false,
                configurable: false
            });
    }
}

/**
 * Logs specified formatted message to console, injecting the result of
 * the function applied
 */
export function LogResult(format?: string) {
    return function(target: Object, key: PropertyKey, descriptor: PropertyDescriptor) {
        const origin = descriptor.value;

        descriptor.value = function(...args: any[]) {
            const result = JSON.stringify(origin.apply(this, args), null, 2);
            console.log(format ? format.replace(/%[ndsf]|\$[\w]+/ig, result) : result);
        };

        return descriptor;
    }
}

export function TryCatch(options?: { nolog?: boolean, callback?: Function }) {
    return function(target: Object, key: PropertyKey, descriptor: PropertyDescriptor) {
        const origin = descriptor.value;

        descriptor.value = function(...args: any[]) {
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
        return descriptor;
    }
}

export function Promisify(target: Object, key: PropertyKey, descriptor: PropertyDescriptor) {
    const origin = descriptor.value;
    descriptor.value = function(...args: any[]) {
        return new Promise((res, rej) => {
            const callback = (err: Error, data: any) => err ? rej(err) : res(data);
            origin.apply(this, [...args, callback]);
        });
    }
    return descriptor;
}

const _PROVIDERS = {};

function getProvider(name: string) {
    return _PROVIDERS[name];
}

export function Provider(ctor: {new (...args: any[])}) {
    _PROVIDERS[ctor.name] = new ctor();
    console.log(`Registered Provider: `, getProvider(ctor.name));
}

export function Inject(providers: Function[]) {
    return function(ctor: {new(...args: any[])}) {
        providers.forEach(provider => {
            ctor.prototype[provider.name] = getProvider(ctor.name);
        });
        return ctor;
    }
}