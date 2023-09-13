"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contains = exports.parentAutofocusables = exports.getAllTabbableNodes = exports.getTabbableNodes = exports.filterAutoFocusable = exports.filterFocusable = void 0;
var array_1 = require("./array");
var is_1 = require("./is");
var tabOrder_1 = require("./tabOrder");
var tabUtils_1 = require("./tabUtils");
/**
 * given list of focusable elements keeps the ones user can interact with
 * @param nodes
 * @param visibilityCache
 */
var filterFocusable = function (nodes, visibilityCache) {
    return (0, array_1.toArray)(nodes)
        .filter(function (node) { return (0, is_1.isVisibleCached)(visibilityCache, node); })
        .filter(function (node) { return (0, is_1.notHiddenInput)(node); });
};
exports.filterFocusable = filterFocusable;
var filterAutoFocusable = function (nodes, cache) {
    if (cache === void 0) { cache = new Map(); }
    return (0, array_1.toArray)(nodes).filter(function (node) { return (0, is_1.isAutoFocusAllowedCached)(cache, node); });
};
exports.filterAutoFocusable = filterAutoFocusable;
/**
 * only tabbable ones
 * (but with guards which would be ignored)
 */
var getTabbableNodes = function (topNodes, visibilityCache, withGuards) {
    return (0, tabOrder_1.orderByTabIndex)((0, exports.filterFocusable)((0, tabUtils_1.getFocusables)(topNodes, withGuards), visibilityCache), true, withGuards);
};
exports.getTabbableNodes = getTabbableNodes;
/**
 * actually anything "focusable", not only tabbable
 * (without guards, as long as they are not expected to be focused)
 */
var getAllTabbableNodes = function (topNodes, visibilityCache) {
    return (0, tabOrder_1.orderByTabIndex)((0, exports.filterFocusable)((0, tabUtils_1.getFocusables)(topNodes), visibilityCache), false);
};
exports.getAllTabbableNodes = getAllTabbableNodes;
/**
 * return list of nodes which are expected to be auto-focused
 * @param topNode
 * @param visibilityCache
 */
var parentAutofocusables = function (topNode, visibilityCache) {
    return (0, exports.filterFocusable)((0, tabUtils_1.getParentAutofocusables)(topNode), visibilityCache);
};
exports.parentAutofocusables = parentAutofocusables;
/*
 * Determines if element is contained in scope, including nested shadow DOMs
 */
var contains = function (scope, element) {
    if (scope.shadowRoot) {
        return (0, exports.contains)(scope.shadowRoot, element);
    }
    else {
        if (Object.getPrototypeOf(scope).contains !== undefined &&
            Object.getPrototypeOf(scope).contains.call(scope, element)) {
            return true;
        }
        return (0, array_1.toArray)(scope.children).some(function (child) {
            var _a;
            if (child instanceof HTMLIFrameElement) {
                var iframeBody = (_a = child.contentDocument) === null || _a === void 0 ? void 0 : _a.body;
                if (iframeBody) {
                    return (0, exports.contains)(iframeBody, element);
                }
                return false;
            }
            return (0, exports.contains)(child, element);
        });
    }
};
exports.contains = contains;
