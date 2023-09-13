declare function getAllFocusable<T extends HTMLElement>(container: T): T[];
declare function getFirstFocusable<T extends HTMLElement>(container: T): T | null;
declare function getAllTabbable<T extends HTMLElement>(container: T, fallbackToFocusable?: boolean): T[];
declare function getFirstTabbableIn<T extends HTMLElement>(container: T, fallbackToFocusable?: boolean): T | null;
declare function getLastTabbableIn<T extends HTMLElement>(container: T, fallbackToFocusable?: boolean): T | null;
declare function getNextTabbable<T extends HTMLElement>(container: T, fallbackToFocusable?: boolean): T | null;
declare function getPreviousTabbable<T extends HTMLElement>(container: T, fallbackToFocusable?: boolean): T | null;
declare function focusNextTabbable<T extends HTMLElement>(container: T, fallbackToFocusable?: boolean): void;
declare function focusPreviousTabbable<T extends HTMLElement>(container: T, fallbackToFocusable?: boolean): void;
declare function closest<T extends HTMLElement>(element: T, selectors: string): Element | null;

export { closest, focusNextTabbable, focusPreviousTabbable, getAllFocusable, getAllTabbable, getFirstFocusable, getFirstTabbableIn, getLastTabbableIn, getNextTabbable, getPreviousTabbable };
