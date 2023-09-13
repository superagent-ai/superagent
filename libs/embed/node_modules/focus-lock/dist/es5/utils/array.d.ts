interface ListOf<TNode> {
    length: number;
    [index: number]: TNode;
}
export declare const toArray: <T>(a: ListOf<T> | T[]) => T[];
export declare const asArray: <T>(a: T | T[]) => T[];
export declare const getFirst: <T>(a: T | T[]) => T;
export {};
