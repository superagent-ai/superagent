import { RefObject } from 'react';
export declare function getClosestBody(el: Element | HTMLElement | HTMLIFrameElement | null): HTMLElement | null;
export interface BodyInfoItem {
    counter: number;
    initialOverflow: CSSStyleDeclaration['overflow'];
}
declare const _default: (_locked?: boolean, _elementRef?: RefObject<HTMLElement> | undefined) => void;
export default _default;
