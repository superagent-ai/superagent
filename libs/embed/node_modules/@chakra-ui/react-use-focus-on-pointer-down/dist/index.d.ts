interface UseFocusOnMouseDownProps {
    enabled?: boolean;
    ref: React.RefObject<HTMLElement>;
    elements?: Array<React.RefObject<HTMLElement> | HTMLElement | null>;
}
/**
 * Polyfill to get `relatedTarget` working correctly consistently
 * across all browsers.
 *
 * It ensures that elements receives focus on pointer down if
 * it's not the active element.
 *
 * @internal
 */
declare function useFocusOnPointerDown(props: UseFocusOnMouseDownProps): void;

export { UseFocusOnMouseDownProps, useFocusOnPointerDown };
