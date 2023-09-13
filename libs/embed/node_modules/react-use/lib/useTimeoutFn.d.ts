export declare type UseTimeoutFnReturn = [() => boolean | null, () => void, () => void];
export default function useTimeoutFn(fn: Function, ms?: number): UseTimeoutFnReturn;
