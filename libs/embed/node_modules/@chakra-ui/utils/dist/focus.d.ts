import { isActiveElement, FocusableElement } from './tabbable.js';

interface ExtendedFocusOptions extends FocusOptions {
    /**
     * Function that determines if the element is the active element
     */
    isActive?: typeof isActiveElement;
    /**
     * If true, the element will be focused in the next tick
     */
    nextTick?: boolean;
    /**
     * If true and element is an input element, the input's text will be selected
     */
    selectTextIfInput?: boolean;
}
declare function focus(element: FocusableElement | null, options?: ExtendedFocusOptions): number;

export { ExtendedFocusOptions, focus };
