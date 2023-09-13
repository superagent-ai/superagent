import { VisibilityCache } from './is';
/**
 * finds a parent for both nodeA and nodeB
 * @param nodeA
 * @param nodeB
 * @returns {boolean|*}
 */
export declare const getCommonParent: (nodeA: Element, nodeB: Element) => Element | false;
export declare const getTopCommonParent: (baseActiveElement: Element | Element[], leftEntry: Element | Element[], rightEntries: Element[]) => Element;
/**
 * return list of nodes which are expected to be autofocused inside a given top nodes
 * @param entries
 * @param visibilityCache
 */
export declare const allParentAutofocusables: (entries: Element[], visibilityCache: VisibilityCache) => Element[];
