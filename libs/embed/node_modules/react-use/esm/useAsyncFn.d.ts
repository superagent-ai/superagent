import { DependencyList } from 'react';
import { FunctionReturningPromise, PromiseType } from './misc/types';
export declare type AsyncState<T> = {
    loading: boolean;
    error?: undefined;
    value?: undefined;
} | {
    loading: true;
    error?: Error | undefined;
    value?: T;
} | {
    loading: false;
    error: Error;
    value?: undefined;
} | {
    loading: false;
    error?: undefined;
    value: T;
};
declare type StateFromFunctionReturningPromise<T extends FunctionReturningPromise> = AsyncState<PromiseType<ReturnType<T>>>;
export declare type AsyncFnReturn<T extends FunctionReturningPromise = FunctionReturningPromise> = [
    StateFromFunctionReturningPromise<T>,
    T
];
export default function useAsyncFn<T extends FunctionReturningPromise>(fn: T, deps?: DependencyList, initialState?: StateFromFunctionReturningPromise<T>): AsyncFnReturn<T>;
export {};
