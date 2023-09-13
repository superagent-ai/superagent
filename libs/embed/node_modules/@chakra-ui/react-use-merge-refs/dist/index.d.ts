type ReactRef<T> = React.RefCallback<T> | React.MutableRefObject<T>;
declare function assignRef<T = any>(ref: ReactRef<T> | null | undefined, value: T): void;
declare function mergeRefs<T>(...refs: (ReactRef<T> | null | undefined)[]): (node: T | null) => void;
declare function useMergeRefs<T>(...refs: (ReactRef<T> | null | undefined)[]): (node: T | null) => void;

export { ReactRef, assignRef, mergeRefs, useMergeRefs };
