import { FocusableElement } from '@chakra-ui/dom-utils';
import { RefObject } from 'react';

interface UseFocusOnHideOptions {
    focusRef: RefObject<FocusableElement>;
    shouldFocus?: boolean;
    visible?: boolean;
}
/**
 * Popover hook to manage the focus when the popover closes or hides.
 *
 * We either want to return focus back to the popover trigger or
 * let focus proceed normally if user moved to another interactive
 * element in the viewport.
 */
declare function useFocusOnHide(containerRef: RefObject<HTMLElement>, options: UseFocusOnHideOptions): void;
interface UseFocusOnShowOptions {
    visible?: boolean;
    shouldFocus?: boolean;
    preventScroll?: boolean;
    focusRef?: React.RefObject<FocusableElement>;
}
declare function useFocusOnShow<T extends HTMLElement>(target: React.RefObject<T> | T, options?: UseFocusOnShowOptions): void;

export { UseFocusOnHideOptions, UseFocusOnShowOptions, useFocusOnHide, useFocusOnShow };
