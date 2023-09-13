declare function isElement(el: any): el is Element;
declare function isHTMLElement(el: any): el is HTMLElement;
declare function getOwnerWindow(node?: Element | null): typeof globalThis;
declare function getOwnerDocument(node?: Element | null): Document;
declare function getEventWindow(event: Event): Window & typeof globalThis;
declare function isBrowser(): boolean;
declare function getActiveElement(node?: HTMLElement): HTMLElement;
declare function contains(parent: HTMLElement | null, child: HTMLElement): boolean;

export { contains, getActiveElement, getEventWindow, getOwnerDocument, getOwnerWindow, isBrowser, isElement, isHTMLElement };
