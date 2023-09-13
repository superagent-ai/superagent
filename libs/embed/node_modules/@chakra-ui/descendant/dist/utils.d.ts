import { useLayoutEffect } from 'react';

/**
 * Sort an array of DOM nodes according to the HTML tree order
 * @see http://www.w3.org/TR/html5/infrastructure.html#tree-order
 */
declare function sortNodes(nodes: Node[]): Node[];
declare const isElement: (el: any) => el is HTMLElement;
declare function getNextIndex(current: number, max: number, loop: boolean): number;
declare function getPrevIndex(current: number, max: number, loop: boolean): number;
declare const useSafeLayoutEffect: typeof useLayoutEffect;
declare const cast: <T>(value: any) => T;

export { cast, getNextIndex, getPrevIndex, isElement, sortNodes, useSafeLayoutEffect };
