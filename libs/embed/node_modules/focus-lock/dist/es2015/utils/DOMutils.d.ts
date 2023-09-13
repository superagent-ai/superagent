import { VisibilityCache } from './is';
import { NodeIndex } from './tabOrder';
/**
 * given list of focusable elements keeps the ones user can interact with
 * @param nodes
 * @param visibilityCache
 */
export declare const filterFocusable: (nodes: HTMLElement[], visibilityCache: VisibilityCache) => HTMLElement[];
export declare const filterAutoFocusable: (nodes: HTMLElement[], cache?: VisibilityCache) => HTMLElement[];
/**
 * only tabbable ones
 * (but with guards which would be ignored)
 */
export declare const getTabbableNodes: (topNodes: Element[], visibilityCache: VisibilityCache, withGuards?: boolean | undefined) => NodeIndex[];
/**
 * actually anything "focusable", not only tabbable
 * (without guards, as long as they are not expected to be focused)
 */
export declare const getAllTabbableNodes: (topNodes: Element[], visibilityCache: VisibilityCache) => NodeIndex[];
/**
 * return list of nodes which are expected to be auto-focused
 * @param topNode
 * @param visibilityCache
 */
export declare const parentAutofocusables: (topNode: Element, visibilityCache: VisibilityCache) => Element[];
export declare const contains: (scope: Element | ShadowRoot, element: Element) => boolean;
