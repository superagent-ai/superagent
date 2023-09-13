type InitialState = boolean | (() => boolean);
/**
 * React hook to manage boolean (on - off) states
 *
 * @param initialState the initial boolean state value
 *
 * @see Docs https://chakra-ui.com/docs/hooks/use-boolean
 */
declare function useBoolean(initialState?: InitialState): readonly [boolean, {
    on: () => void;
    off: () => void;
    toggle: () => void;
}];

export { useBoolean };
