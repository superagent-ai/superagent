type Predicate<R = any> = (value: any, path: string[]) => R;
type MappedObject<T, K> = {
    [Prop in keyof T]: T[Prop] extends Array<any> ? MappedObject<T[Prop][number], K>[] : T[Prop] extends Record<string, unknown> ? MappedObject<T[Prop], K> : K;
};
type WalkObjectStopFn = (value: any, path: string[]) => boolean;
type WalkObjectOptions = {
    stop?: WalkObjectStopFn;
    getKey?(prop: string): string;
};
declare function walkObject<T, K>(target: T, predicate: Predicate<K>, options?: WalkObjectOptions): MappedObject<T, ReturnType<Predicate<K>>>;
declare function mapObject(obj: any, fn: (value: any) => any): any;

export { MappedObject, WalkObjectOptions, WalkObjectStopFn, mapObject, walkObject };
