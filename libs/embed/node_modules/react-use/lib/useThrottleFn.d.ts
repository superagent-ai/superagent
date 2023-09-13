declare const useThrottleFn: <T, U extends any[]>(fn: (...args: U) => T, ms: number | undefined, args: U) => T | null;
export default useThrottleFn;
