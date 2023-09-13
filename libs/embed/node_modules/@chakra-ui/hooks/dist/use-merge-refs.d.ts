type ReactRef<T> = React.Ref<T> | React.MutableRefObject<T>;
declare function assignRef<T = any>(ref: ReactRef<T> | undefined, value: T): void;
/**
 * React hook that merges react refs into a single memoized function
 *
 * @example
 * import React from "react";
 * import { useMergeRefs } from `@chakra-ui/hooks`;
 *
 * const Component = React.forwardRef((props, ref) => {
 *   const internalRef = React.useRef();
 *   return <div {...props} ref={useMergeRefs(internalRef, ref)} />;
 * });
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-merge-refs
 */
declare function useMergeRefs<T>(...refs: (ReactRef<T> | undefined)[]): ((node: T) => void) | null;

export { assignRef, useMergeRefs };
