"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefined = exports.isNotAGuard = exports.isGuard = exports.isAutoFocusAllowed = exports.notHiddenInput = exports.isRadioElement = exports.isHTMLInputElement = exports.isHTMLButtonElement = exports.getDataset = exports.isAutoFocusAllowedCached = exports.isVisibleCached = void 0;
var constants_1 = require("../constants");
var isElementHidden = function (node) {
    // we can measure only "elements"
    // consider others as "visible"
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }
    var computedStyle = window.getComputedStyle(node, null);
    if (!computedStyle || !computedStyle.getPropertyValue) {
        return false;
    }
    return (computedStyle.getPropertyValue('display') === 'none' || computedStyle.getPropertyValue('visibility') === 'hidden');
};
var getParentNode = function (node) {
    // DOCUMENT_FRAGMENT_NODE can also point on ShadowRoot. In this case .host will point on the next node
    return node.parentNode && node.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            node.parentNode.host
        : node.parentNode;
};
var isTopNode = function (node) {
    // @ts-ignore
    return node === document || (node && node.nodeType === Node.DOCUMENT_NODE);
};
var isVisibleUncached = function (node, checkParent) {
    return !node || isTopNode(node) || (!isElementHidden(node) && checkParent(getParentNode(node)));
};
var isVisibleCached = function (visibilityCache, node) {
    var cached = visibilityCache.get(node);
    if (cached !== undefined) {
        return cached;
    }
    var result = isVisibleUncached(node, exports.isVisibleCached.bind(undefined, visibilityCache));
    visibilityCache.set(node, result);
    return result;
};
exports.isVisibleCached = isVisibleCached;
var isAutoFocusAllowedUncached = function (node, checkParent) {
    return node && !isTopNode(node) ? ((0, exports.isAutoFocusAllowed)(node) ? checkParent(getParentNode(node)) : false) : true;
};
var isAutoFocusAllowedCached = function (cache, node) {
    var cached = cache.get(node);
    if (cached !== undefined) {
        return cached;
    }
    var result = isAutoFocusAllowedUncached(node, exports.isAutoFocusAllowedCached.bind(undefined, cache));
    cache.set(node, result);
    return result;
};
exports.isAutoFocusAllowedCached = isAutoFocusAllowedCached;
var getDataset = function (node) {
    // @ts-ignore
    return node.dataset;
};
exports.getDataset = getDataset;
var isHTMLButtonElement = function (node) { return node.tagName === 'BUTTON'; };
exports.isHTMLButtonElement = isHTMLButtonElement;
var isHTMLInputElement = function (node) { return node.tagName === 'INPUT'; };
exports.isHTMLInputElement = isHTMLInputElement;
var isRadioElement = function (node) {
    return (0, exports.isHTMLInputElement)(node) && node.type === 'radio';
};
exports.isRadioElement = isRadioElement;
var notHiddenInput = function (node) {
    return !(((0, exports.isHTMLInputElement)(node) || (0, exports.isHTMLButtonElement)(node)) && (node.type === 'hidden' || node.disabled));
};
exports.notHiddenInput = notHiddenInput;
var isAutoFocusAllowed = function (node) {
    var attribute = node.getAttribute(constants_1.FOCUS_NO_AUTOFOCUS);
    return ![true, 'true', ''].includes(attribute);
};
exports.isAutoFocusAllowed = isAutoFocusAllowed;
var isGuard = function (node) { var _a; return Boolean(node && ((_a = (0, exports.getDataset)(node)) === null || _a === void 0 ? void 0 : _a.focusGuard)); };
exports.isGuard = isGuard;
var isNotAGuard = function (node) { return !(0, exports.isGuard)(node); };
exports.isNotAGuard = isNotAGuard;
var isDefined = function (x) { return Boolean(x); };
exports.isDefined = isDefined;
