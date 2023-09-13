import { IHookStateInitAction, IHookStateSetAction } from './misc/hookState';
export interface ListActions<T> {
    /**
     * @description Set new list instead old one
     */
    set: (newList: IHookStateSetAction<T[]>) => void;
    /**
     * @description Add item(s) at the end of list
     */
    push: (...items: T[]) => void;
    /**
     * @description Replace item at given position. If item at given position not exists it will be set.
     */
    updateAt: (index: number, item: T) => void;
    /**
     * @description Insert item at given position, all items to the right will be shifted.
     */
    insertAt: (index: number, item: T) => void;
    /**
     * @description Replace all items that matches predicate with given one.
     */
    update: (predicate: (a: T, b: T) => boolean, newItem: T) => void;
    /**
     * @description Replace first item matching predicate with given one.
     */
    updateFirst: (predicate: (a: T, b: T) => boolean, newItem: T) => void;
    /**
     * @description Like `updateFirst` bit in case of predicate miss - pushes item to the list
     */
    upsert: (predicate: (a: T, b: T) => boolean, newItem: T) => void;
    /**
     * @description Sort list with given sorting function
     */
    sort: (compareFn?: (a: T, b: T) => number) => void;
    /**
     * @description Same as native Array's method
     */
    filter: (callbackFn: (value: T, index?: number, array?: T[]) => boolean, thisArg?: any) => void;
    /**
     * @description Removes item at given position. All items to the right from removed will be shifted.
     */
    removeAt: (index: number) => void;
    /**
     * @deprecated Use removeAt method instead
     */
    remove: (index: number) => void;
    /**
     * @description Make the list empty
     */
    clear: () => void;
    /**
     * @description Reset list to initial value
     */
    reset: () => void;
}
declare function useList<T>(initialList?: IHookStateInitAction<T[]>): [T[], ListActions<T>];
export default useList;
