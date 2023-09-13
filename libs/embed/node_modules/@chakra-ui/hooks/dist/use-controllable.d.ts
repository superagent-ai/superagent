import * as react from 'react';

declare function useControllableProp<T>(prop: T | undefined, state: T): readonly [boolean, T];
interface UseControllableStateProps<T> {
    /**
     * The value to used in controlled mode
     */
    value?: T;
    /**
     * The initial value to be used, in uncontrolled mode
     */
    defaultValue?: T | (() => T);
    /**
     * The callback fired when the value changes
     */
    onChange?: (value: T) => void;
    /**
     * The function that determines if the state should be updated
     */
    shouldUpdate?: (prev: T, next: T) => boolean;
}
/**
 * React hook for using controlling component state.
 * @param props
 */
declare function useControllableState<T>(props: UseControllableStateProps<T>): [T, react.Dispatch<react.SetStateAction<T>>];

export { UseControllableStateProps, useControllableProp, useControllableState };
