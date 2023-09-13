import { DependencyList } from 'react';
import { AsyncState } from './useAsync';
export declare type AsyncStateRetry<T> = AsyncState<T> & {
    retry(): void;
};
declare const useAsyncRetry: <T>(fn: () => Promise<T>, deps?: DependencyList) => {
    retry: () => void;
    loading: boolean;
    error?: undefined;
    value?: undefined;
} | {
    retry: () => void;
    loading: false;
    error: Error;
    value?: undefined;
} | {
    retry: () => void;
    loading: true;
    error?: Error | undefined;
    value?: T | undefined;
} | {
    retry: () => void;
    loading: false;
    error?: undefined;
    value: T;
};
export default useAsyncRetry;
