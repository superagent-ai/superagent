import { Booleanish, EventKeys } from './types.js';

declare function isElement(el: any): el is Element;
declare function isHTMLElement(el: any): el is HTMLElement;
declare function getOwnerWindow(node?: Element | null): typeof globalThis;
declare function getOwnerDocument(node?: Element | null): Document;
declare function getEventWindow(event: Event): typeof globalThis;
declare function canUseDOM(): boolean;
declare const isBrowser: boolean;
declare const dataAttr: (condition: boolean | undefined) => Booleanish;
declare const ariaAttr: (condition: boolean | undefined) => true | undefined;
declare const cx: (...classNames: any[]) => string;
declare function getActiveElement(node?: HTMLElement): HTMLElement;
declare function contains(parent: HTMLElement | null, child: HTMLElement): boolean;
declare function addDomEvent(target: EventTarget, eventName: string, handler: EventListener, options?: AddEventListenerOptions): () => void;
/**
 * Get the normalized event key across all browsers
 * @param event keyboard event
 */
declare function normalizeEventKey(event: Pick<KeyboardEvent, "key" | "keyCode">): EventKeys;
declare function getRelatedTarget(event: Pick<FocusEvent, "relatedTarget" | "target" | "currentTarget">): HTMLElement;
declare function isRightClick(event: Pick<MouseEvent, "button">): boolean;

export { addDomEvent, ariaAttr, canUseDOM, contains, cx, dataAttr, getActiveElement, getEventWindow, getOwnerDocument, getOwnerWindow, getRelatedTarget, isBrowser, isElement, isHTMLElement, isRightClick, normalizeEventKey };
