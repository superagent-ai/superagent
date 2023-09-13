export { FocusableElement, hasDisplayNone, hasFocusWithin, hasNegativeTabIndex, hasTabIndex, isActiveElement, isContentEditable, isDisabled, isFocusable, isHidden, isInputElement, isTabbable } from './tabbable.js';
export { contains, getActiveElement, getEventWindow, getOwnerDocument, getOwnerWindow, isBrowser, isElement, isHTMLElement } from './dom.js';
export { getScrollParent } from './scroll.js';

declare function getAllFocusable<T extends HTMLElement>(container: T): T[];
declare function getFirstFocusable<T extends HTMLElement>(container: T): T | null;
declare function getAllTabbable<T extends HTMLElement>(container: T, fallbackToFocusable?: boolean): T[];
declare function getFirstTabbableIn<T extends HTMLElement>(container: T, fallbackToFocusable?: boolean): T | null;
declare function getLastTabbableIn<T extends HTMLElement>(container: T, fallbackToFocusable?: boolean): T | null;
declare function getNextTabbable<T extends HTMLElement>(container: T, fallbackToFocusable?: boolean): T | null;
declare function getPreviousTabbable<T extends HTMLElement>(container: T, fallbackToFocusable?: boolean): T | null;

export { getAllFocusable, getAllTabbable, getFirstFocusable, getFirstTabbableIn, getLastTabbableIn, getNextTabbable, getPreviousTabbable };
