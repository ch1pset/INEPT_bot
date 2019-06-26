
const _PROVIDERS = {};

function getProvider(name: string) {
    return _PROVIDERS[name];
}

class Injector {
    private _providers: {[name: string]: Object | Function}
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