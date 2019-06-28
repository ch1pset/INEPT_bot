/**
 * Primitives
 */
export type bool = boolean;
export type num = number;
export type str = string;

/**
 * Functions
 */
export type NodeCallback = (error: Error, success: any) => void;
export type Callback<T> = (...args: any[]) => T;

export type fn = Function;
export type Constructor = {new(...args: any[])};
export type Decorator<T> = (target: T, key?: PropertyKey, method?: PropertyDescriptor) => any;
export type Singleton<T> = SingletonFunction<T>;

interface SingletonFunction<T> {
    self: T;
    apply(this: Function, thisArg: any, argArry?: any): any;
    call(this: Function, thisArg: any, argArry?: any): any;
    bind(this: Function, thisArg: any, argArry?: any): any;
    toString(): string;
    prototype: any;
    name: string;
    readonly length: number;
    arguments: any;
    caller: Function;
};