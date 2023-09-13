declare const cx: (...classNames: any[]) => string;
declare function isObject(value: any): value is Record<string, any>;
declare type MessageOptions = {
    condition: boolean;
    message: string;
};
declare const warn: (options: MessageOptions) => void;
declare function runIfFn<T, U>(valueOrFn: T | ((...fnArgs: U[]) => T), ...args: U[]): T;
declare type Booleanish = boolean | "true" | "false";
declare const dataAttr: (condition: boolean | undefined) => Booleanish;
declare const ariaAttr: (condition: boolean | undefined) => true | undefined;
declare type Args<T extends Function> = T extends (...args: infer R) => any ? R : never;
declare type AnyFunction<T = any> = (...args: T[]) => any;
declare function callAllHandlers<T extends (event: any) => void>(...fns: (T | undefined)[]): (event: Args<T>[0]) => void;
declare function callAll<T extends AnyFunction>(...fns: (T | undefined)[]): (arg: Args<T>[0]) => void;

export { ariaAttr, callAll, callAllHandlers, cx, dataAttr, isObject, runIfFn, warn };
