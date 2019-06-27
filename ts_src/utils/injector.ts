import { fn, Constructor, Singleton, Decorator } from "./types";

// export class Injector {
//     private _providers: Service[] = [];
    
//     private static _self: Injector = new Injector();
//     private constructor() {
//         console.log(`Injector was instantiated`);
//     }
//     static get self() { return Injector._self; }

//     newProvider(ctor: Singleton<Service>): void {
//         // console.log(ctor.prototype, ctor.self);
//         this._providers.push(ctor.self);
//     }
//     getProvider(ctor: Singleton<Service>): Service {
//         return this._providers.find(p => p === ctor.self);
//     }
// }

// export function Provider(ctor: Singleton<Service>) {
//     Injector.self.newProvider(ctor);
//     // console.log(`Registered Provider: `, Injector.self.getProvider(ctor));
// }

// export function Inject(providers: Singleton<Service>[]) {
//     return function<T extends {new(...args:any[]):{}}>(constructor:T) {
//         return class extends constructor {
//             constructor(...args: any[]) {
//                 super(args);
//             }
//         }
//     }
// }

export abstract class Service {
    private static readonly _self: Service;
    private constructor() { }
    static self: Service;
}

export function Inject(provider: Singleton<Service>): Decorator<Service> {
    return function(target, key) {
        target[key] = provider.self;
    }
}

// class OtherService {
//     private static readonly _self = new OtherService();
//     private constructor() {}
//     static get self() {
//         return OtherService._self;
//     }
//     method() {
//         setTimeout(() => console.log(`Service provided...`), 1000);
//     }
// }

// class A {
//     @Inject(OtherService) private serve: OtherService;
//     constructor() { }
//     method() {
//         console.log(`Getting service...`);
//         this.serve.method();
//     }
// }

// const a = new A();
// a.method();