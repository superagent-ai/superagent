import { FOCUS_NO_AUTOFOCUS } from '../constants';
const isElementHidden = (node) => {
    // we can measure only "elements"
    // consider others as "visible"
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }
    const computedStyle = window.getComputedStyle(node, null);
    if (!computedStyle || !computedStyle.getPropertyValue) {
        return false;
    }
    return (computedStyle.getPropertyValue('display') === 'none' || computedStyle.getPropertyValue('visibility') === 'hidden');
};
const getParentNode = (node) => 
// DOCUMENT_FRAGMENT_NODE can also point on ShadowRoot. In this case .host will point on the next node
node.parentNode && node.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        node.parentNode.host
    : node.parentNode;
const isTopNode = (node) => 
// @ts-ignore
node === document || (node && node.nodeType === Node.DOCUMENT_NODE);
const isVisibleUncached = (node, checkParent) => !node || isTopNode(node) || (!isElementHidden(node) && checkParent(getParentNode(node)));
export const isVisibleCached = (visibilityCache, node) => {
    const cached = visibilityCache.get(node);
    if (cached !== undefined) {
        return cached;
    }
    const result = isVisibleUncached(node, isVisibleCached.bind(undefined, visibilityCache));
    visibilityCache.set(node, result);
    return result;
};
const isAutoFocusAllowedUncached = (node, checkParent) => node && !isTopNode(node) ? (isAutoFocusAllowed(node) ? checkParent(getParentNode(node)) : false) : true;
export const isAutoFocusAllowedCached = (cache, node) => {
    const cached = cache.get(node);
    if (cached !== undefined) {
        return cached;
    }
    const result = isAutoFocusAllowedUncached(node, isAutoFocusAllowedCached.bind(undefined, cache));
    cache.set(node, result);
    return result;
};
export const getDataset = (node) => 
// @ts-ignore
node.dataset;
export const isHTMLButtonElement = (node) => node.tagName === 'BUTTON';
export const isHTMLInputElement = (node) => node.tagName === 'INPUT';
export const isRadioElement = (node) => isHTMLInputElement(node) && node.type === 'radio';
export const notHiddenInput = (node) => !((isHTMLInputElement(node) || isHTMLButtonElement(node)) && (node.type === 'hidden' || node.disabled));
export const isAutoFocusAllowed = (node) => {
    const attribute = node.getAttribute(FOCUS_NO_AUTOFOCUS);
    return ![true, 'true', ''].includes(attribute);
};
export const isGuard = (node) => { var _a; return Boolean(node && ((_a = getDataset(node)) === null || _a === void 0 ? void 0 : _a.focusGuard)); };
export const isNotAGuard = (node) => !isGuard(node);
export const isDefined = (x) => Boolean(x);
