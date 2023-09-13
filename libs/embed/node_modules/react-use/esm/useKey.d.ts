import { DependencyList } from 'react';
import { UseEventOptions, UseEventTarget } from './useEvent';
export declare type KeyPredicate = (event: KeyboardEvent) => boolean;
export declare type KeyFilter = null | undefined | string | ((event: KeyboardEvent) => boolean);
export declare type Handler = (event: KeyboardEvent) => void;
export interface UseKeyOptions<T extends UseEventTarget> {
    event?: 'keydown' | 'keypress' | 'keyup';
    target?: T | null;
    options?: UseEventOptions<T>;
}
declare const useKey: <T extends UseEventTarget>(key: KeyFilter, fn?: Handler, opts?: UseKeyOptions<T>, deps?: DependencyList) => void;
export default useKey;
