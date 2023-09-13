import * as react from 'react';

/**
 * Given a prop value and state value, the useControllableProp hook is used to determine whether a component is controlled or uncontrolled, and also returns the computed value.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-controllable#usecontrollableprop
 */
declare function useControllableProp<T>(prop: T | undefined, state: T): [boolean, T];
interface UseControllableStateProps<T> {
    value?: T;
    defaultValue?: T | (() => T);
    onChange?: (value: T) => void;
    shouldUpdate?: (prev: T, next: T) => boolean;
}
/**
 * The `useControllableState` hook returns the state and function that updates the state, just like React.useState does.
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-controllable#usecontrollablestate
 */
declare function useControllableState<T>(props: UseControllableStateProps<T>): [T, react.Dispatch<react.SetStateAction<T>>];

export { UseControllableStateProps, useControllableProp, useControllableState };
