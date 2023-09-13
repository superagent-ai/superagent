import { DependencyList } from 'react';
export declare type UseDebounceReturn = [() => boolean | null, () => void];
export default function useDebounce(fn: Function, ms?: number, deps?: DependencyList): UseDebounceReturn;
