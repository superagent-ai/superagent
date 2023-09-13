declare function useCallbackRef<T extends (...args: any[]) => any>(callback: T | undefined, deps?: React.DependencyList): T;

export { useCallbackRef };
