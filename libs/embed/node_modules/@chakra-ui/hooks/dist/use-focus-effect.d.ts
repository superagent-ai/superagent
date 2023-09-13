type UseFocusEffectOptions = {
    shouldFocus: boolean;
    preventScroll?: boolean;
};
/**
 * React hook to focus an element conditionally
 *
 * @param ref the ref of the element to focus
 * @param options focus management options
 */
declare function useFocusEffect<T extends HTMLElement>(ref: React.RefObject<T>, options: UseFocusEffectOptions): void;

export { UseFocusEffectOptions, useFocusEffect };
