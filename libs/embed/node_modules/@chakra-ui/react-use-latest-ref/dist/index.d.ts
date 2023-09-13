import * as react from 'react';

/**
 * React hook to persist any value between renders,
 * but keeps it up-to-date if it changes.
 *
 * @param value the value or function to persist
 */
declare function useLatestRef<T>(value: T): react.MutableRefObject<T>;

export { useLatestRef };
