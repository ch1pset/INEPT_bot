import { fn } from '../typedefs';

export function Mixin(...mixins: {[name: string]: any}[]): fn {
    return function(ctor: fn) {
        mixins.forEach(mixin => {
            console.log(`Applying mixin ${mixin.name ? mixin.name + ' ' : ''}to ${ctor.name}...`);
            if(mixin.prototype) {
                const proto = Object.getOwnPropertyDescriptors(mixin.prototype);
                for(let name in proto) {
                    Object.defineProperty(ctor.prototype, name, proto[name]);
                }
            }
            else {
                Object.assign(ctor, mixin);
            }
        });
    }
}