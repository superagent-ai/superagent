import { Dict } from './types.js';

declare function isNumber(value: any): value is number;
declare function isNotNumber(value: any): boolean;
declare function isNumeric(value: any): boolean;
declare function isArray<T>(value: any): value is Array<T>;
declare function isEmptyArray(value: any): boolean;
declare function isFunction<T extends Function = Function>(value: any): value is T;
declare function isDefined(value: any): boolean;
declare function isUndefined(value: any): value is undefined;
declare function isObject(value: any): value is Dict;
declare function isEmptyObject(value: any): boolean;
declare function isNotEmptyObject(value: any): value is object;
declare function isNull(value: any): value is null;
declare function isString(value: any): value is string;
declare function isCssVar(value: string): boolean;
declare function isEmpty(value: any): boolean;
declare const __DEV__: boolean;
declare const __TEST__: boolean;
declare function isRefObject(val: any): val is {
    current: any;
};
declare function isInputEvent(value: any): value is {
    target: HTMLInputElement;
};

export { __DEV__, __TEST__, isArray, isCssVar, isDefined, isEmpty, isEmptyArray, isEmptyObject, isFunction, isInputEvent, isNotEmptyObject, isNotNumber, isNull, isNumber, isNumeric, isObject, isRefObject, isString, isUndefined };
