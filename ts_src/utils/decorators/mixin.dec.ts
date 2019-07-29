import { fn } from '../typedefs';

export function Mixin(mixins: fn[]): fn {
    return function(ctor: fn) {
        if(mixins) {
            mixins.forEach(mixin => {
                console.log(`Applying mixin ${mixin.name} to ${ctor.name}...`);
                const proto = Object.getOwnPropertyDescriptors(mixin.prototype);
                for(let name in proto) {
                    Object.defineProperty(ctor.prototype, name, proto[name]);
                }
            });
        }
    }
}