declare type Merge<T, P> = P & Omit<T, keyof P>;
declare type UnionStringArray<T extends Readonly<string[]>> = T[number];
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
declare type LiteralUnion<T extends U, U extends any = string> = T | (U & {
    _?: never;
});
declare type AnyFunction<T = any> = (...args: T[]) => any;
declare type FunctionArguments<T extends Function> = T extends (...args: infer R) => any ? R : never;
declare type Dict<T = any> = Record<string, T>;
declare type Booleanish = boolean | "true" | "false";
declare type StringOrNumber = string | number;
declare type EventKeys = "ArrowDown" | "ArrowUp" | "ArrowLeft" | "ArrowRight" | "Enter" | "Space" | "Tab" | "Backspace" | "Control" | "Meta" | "Home" | "End" | "PageDown" | "PageUp" | "Delete" | "Escape" | " " | "Shift";

export { AnyFunction, Booleanish, Dict, EventKeys, FunctionArguments, LiteralUnion, Merge, Omit, StringOrNumber, UnionStringArray };
