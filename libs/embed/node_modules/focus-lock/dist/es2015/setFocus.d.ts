export declare const focusOn: (target: Element | HTMLFrameElement | HTMLElement, focusOptions?: FocusOptions | undefined) => void;
interface FocusLockFocusOptions {
    focusOptions?: FocusOptions;
}
/**
 * Sets focus at a given node. The last focused element will help to determine which element(first or last) should be focused.
 * HTML markers (see {@link import('./constants').FOCUS_AUTO} constants) can control autofocus
 * @param topNode
 * @param lastNode
 * @param options
 */
export declare const setFocus: (topNode: HTMLElement, lastNode: Element, options?: FocusLockFocusOptions) => void;
export {};
