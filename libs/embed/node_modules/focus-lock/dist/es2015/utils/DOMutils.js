import { toArray } from './array';
import { isAutoFocusAllowedCached, isVisibleCached, notHiddenInput } from './is';
import { orderByTabIndex } from './tabOrder';
import { getFocusables, getParentAutofocusables } from './tabUtils';
/**
 * given list of focusable elements keeps the ones user can interact with
 * @param nodes
 * @param visibilityCache
 */
export var filterFocusable = function (nodes, visibilityCache) {
    return toArray(nodes)
        .filter(function (node) { return isVisibleCached(visibilityCache, node); })
        .filter(function (node) { return notHiddenInput(node); });
};
export var filterAutoFocusable = function (nodes, cache) {
    if (cache === void 0) { cache = new Map(); }
    return toArray(nodes).filter(function (node) { return isAutoFocusAllowedCached(cache, node); });
};
/**
 * only tabbable ones
 * (but with guards which would be ignored)
 */
export var getTabbableNodes = function (topNodes, visibilityCache, withGuards) {
    return orderByTabIndex(filterFocusable(getFocusables(topNodes, withGuards), visibilityCache), true, withGuards);
};
/**
 * actually anything "focusable", not only tabbable
 * (without guards, as long as they are not expected to be focused)
 */
export var getAllTabbableNodes = function (topNodes, visibilityCache) {
    return orderByTabIndex(filterFocusable(getFocusables(topNodes), visibilityCache), false);
};
/**
 * return list of nodes which are expected to be auto-focused
 * @param topNode
 * @param visibilityCache
 */
export var parentAutofocusables = function (topNode, visibilityCache) {
    return filterFocusable(getParentAutofocusables(topNode), visibilityCache);
};
/*
 * Determines if element is contained in scope, including nested shadow DOMs
 */
export var contains = function (scope, element) {
    if (scope.shadowRoot) {
        return contains(scope.shadowRoot, element);
    }
    else {
        if (Object.getPrototypeOf(scope).contains !== undefined &&
            Object.getPrototypeOf(scope).contains.call(scope, element)) {
            return true;
        }
        return toArray(scope.children).some(function (child) {
            var _a;
            if (child instanceof HTMLIFrameElement) {
                var iframeBody = (_a = child.contentDocument) === null || _a === void 0 ? void 0 : _a.body;
                if (iframeBody) {
                    return contains(iframeBody, element);
                }
                return false;
            }
            return contains(child, element);
        });
    }
};
