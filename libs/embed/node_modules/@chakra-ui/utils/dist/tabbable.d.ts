declare const hasDisplayNone: (element: HTMLElement) => boolean;
declare const hasTabIndex: (element: HTMLElement) => boolean;
declare const hasNegativeTabIndex: (element: HTMLElement) => boolean;
declare function isDisabled(element: HTMLElement): boolean;
interface FocusableElement {
    focus(options?: FocusOptions): void;
}
declare function isInputElement(element: FocusableElement): element is HTMLInputElement;
declare function isActiveElement(element: FocusableElement): boolean;
declare function hasFocusWithin(element: HTMLElement): boolean;
declare function isHidden(element: HTMLElement): boolean;
declare function isContentEditable(element: HTMLElement): boolean;
declare function isFocusable(element: HTMLElement): boolean;
declare function isTabbable(element?: HTMLElement | null): boolean;

export { FocusableElement, hasDisplayNone, hasFocusWithin, hasNegativeTabIndex, hasTabIndex, isActiveElement, isContentEditable, isDisabled, isFocusable, isHidden, isInputElement, isTabbable };
