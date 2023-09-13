import { FunctionArguments, AnyFunction } from './types.js';

declare type MaybeFunction<T, Args extends unknown[] = []> = T | ((...args: Args) => T);
declare function runIfFn<T, U>(valueOrFn: T | ((...fnArgs: U[]) => T), ...args: U[]): T;
declare function callAllHandlers<T extends (event: any) => void>(...fns: (T | undefined)[]): (event: FunctionArguments<T>[0]) => void;
declare function callAll<T extends AnyFunction>(...fns: (T | undefined)[]): (arg: FunctionArguments<T>[0]) => void;
declare const compose: <T>(fn1: (...args: T[]) => T, ...fns: ((...args: T[]) => T)[]) => (...args: T[]) => T;
declare function once<T extends AnyFunction>(fn?: T | null): (this: any, ...args: Parameters<T>) => any;
declare const noop: () => void;
declare type MessageOptions = {
    condition: boolean;
    message: string;
};
declare const warn: (this: any, options: MessageOptions) => any;
declare const error: (this: any, options: MessageOptions) => any;
declare const pipe: <R>(...fns: ((a: R) => R)[]) => (v: R) => R;
declare type Point = {
    x: number;
    y: number;
};
declare function distance<P extends Point | number>(a: P, b: P): number;

export { MaybeFunction, callAll, callAllHandlers, compose, distance, error, noop, once, pipe, runIfFn, warn };
