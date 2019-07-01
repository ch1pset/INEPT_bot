/**
 * Primitives
 */
export type bool = boolean;
export type num = number;
export type str = string;
export type arr<T> = Array<T>;

/**
 * Functions
 */
export type NodeCallback<E, S> = (error: E, success: S) => void;
export type Callback<T> = (...args: any[]) => T;

export type fn = Function;
export type Constructor = {new(...args: any[])};
export type Decorator<T> = (target: T, key: PropertyKey, method?: PropertyDescriptor) => any;
