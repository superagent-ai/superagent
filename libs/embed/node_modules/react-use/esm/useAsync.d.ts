import { DependencyList } from 'react';
import { FunctionReturningPromise } from './misc/types';
export { AsyncState, AsyncFnReturn } from './useAsyncFn';
export default function useAsync<T extends FunctionReturningPromise>(fn: T, deps?: DependencyList): import("./useAsyncFn").AsyncState<import("./misc/types").PromiseType<ReturnType<T>>>;
