import { Dict, Omit } from './types.js';
export { default as mergeWith } from 'lodash.mergewith';

declare function omit<T extends Dict, K extends keyof T>(object: T, keys: K[]): Omit<T, K>;
declare function pick<T extends Dict, K extends keyof T>(object: T, keys: K[]): { [P in K]: T[P]; };
declare function split<T extends Dict, K extends keyof T>(object: T, keys: K[]): [{ [P in K]: T[P]; }, Omit<T, K>];
/**
 * Get value from a deeply nested object using a string path.
 * Memorizes the value.
 * @param obj - the object
 * @param path - the string path
 * @param fallback  - the fallback value
 */
declare function get(obj: Record<string, any>, path: string | number, fallback?: any, index?: number): any;
declare type Get = (obj: Readonly<object>, path: string | number, fallback?: any, index?: number) => any;
declare const memoize: (fn: Get) => Get;
declare const memoizedGet: Get;
/**
 * Get value from deeply nested object, based on path
 * It returns the path value if not found in object
 *
 * @param path - the string path or value
 * @param scale - the string path or value
 */
declare function getWithDefault(path: any, scale: any): any;
declare type FilterFn<T> = (value: any, key: string, object: T) => boolean;
/**
 * Returns the items of an object that meet the condition specified in a callback function.
 *
 * @param object the object to loop through
 * @param fn The filter function
 */
declare function objectFilter<T extends Dict>(object: T, fn: FilterFn<T>): Dict<any>;
declare const filterUndefined: (object: Dict) => Dict<any>;
declare const objectKeys: <T extends Dict<any>>(obj: T) => (keyof T)[];
/**
 * Object.entries polyfill for Node v10 compatibility
 */
declare const fromEntries: <T extends unknown>(entries: [
    string,
    any
][]) => T;
/**
 * Get the CSS variable ref stored in the theme
 */
declare const getCSSVar: (theme: Dict, scale: string, value: any) => any;

export { filterUndefined, fromEntries, get, getCSSVar, getWithDefault, memoize, memoizedGet, objectFilter, objectKeys, omit, pick, split };
