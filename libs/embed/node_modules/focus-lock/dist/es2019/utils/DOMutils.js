import { toArray } from './array';
import { isAutoFocusAllowedCached, isVisibleCached, notHiddenInput } from './is';
import { orderByTabIndex } from './tabOrder';
import { getFocusables, getParentAutofocusables } from './tabUtils';
/**
 * given list of focusable elements keeps the ones user can interact with
 * @param nodes
 * @param visibilityCache
 */
export const filterFocusable = (nodes, visibilityCache) => toArray(nodes)
    .filter((node) => isVisibleCached(visibilityCache, node))
    .filter((node) => notHiddenInput(node));
export const filterAutoFocusable = (nodes, cache = new Map()) => toArray(nodes).filter((node) => isAutoFocusAllowedCached(cache, node));
/**
 * only tabbable ones
 * (but with guards which would be ignored)
 */
export const getTabbableNodes = (topNodes, visibilityCache, withGuards) => orderByTabIndex(filterFocusable(getFocusables(topNodes, withGuards), visibilityCache), true, withGuards);
/**
 * actually anything "focusable", not only tabbable
 * (without guards, as long as they are not expected to be focused)
 */
export const getAllTabbableNodes = (topNodes, visibilityCache) => orderByTabIndex(filterFocusable(getFocusables(topNodes), visibilityCache), false);
/**
 * return list of nodes which are expected to be auto-focused
 * @param topNode
 * @param visibilityCache
 */
export const parentAutofocusables = (topNode, visibilityCache) => filterFocusable(getParentAutofocusables(topNode), visibilityCache);
/*
 * Determines if element is contained in scope, including nested shadow DOMs
 */
export const contains = (scope, element) => {
    if (scope.shadowRoot) {
        return contains(scope.shadowRoot, element);
    }
    else {
        if (Object.getPrototypeOf(scope).contains !== undefined &&
            Object.getPrototypeOf(scope).contains.call(scope, element)) {
            return true;
        }
        return toArray(scope.children).some((child) => {
            var _a;
            if (child instanceof HTMLIFrameElement) {
                const iframeBody = (_a = child.contentDocument) === null || _a === void 0 ? void 0 : _a.body;
                if (iframeBody) {
                    return contains(iframeBody, element);
                }
                return false;
            }
            return contains(child, element);
        });
    }
};
