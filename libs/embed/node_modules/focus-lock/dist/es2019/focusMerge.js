import { NEW_FOCUS, newFocus } from './solver';
import { getAllTabbableNodes, getTabbableNodes } from './utils/DOMutils';
import { getAllAffectedNodes } from './utils/all-affected';
import { asArray, getFirst } from './utils/array';
import { pickAutofocus } from './utils/auto-focus';
import { getActiveElement } from './utils/getActiveElement';
import { isDefined, isNotAGuard } from './utils/is';
import { allParentAutofocusables, getTopCommonParent } from './utils/parenting';
const reorderNodes = (srcNodes, dstNodes) => {
    const remap = new Map();
    // no Set(dstNodes) for IE11 :(
    dstNodes.forEach((entity) => remap.set(entity.node, entity));
    // remap to dstNodes
    return srcNodes.map((node) => remap.get(node)).filter(isDefined);
};
/**
 * given top node(s) and the last active element return the element to be focused next
 * @param topNode
 * @param lastNode
 */
export const getFocusMerge = (topNode, lastNode) => {
    const activeElement = getActiveElement(asArray(topNode).length > 0 ? document : getFirst(topNode).ownerDocument);
    const entries = getAllAffectedNodes(topNode).filter(isNotAGuard);
    const commonParent = getTopCommonParent(activeElement || topNode, topNode, entries);
    const visibilityCache = new Map();
    const anyFocusable = getAllTabbableNodes(entries, visibilityCache);
    let innerElements = getTabbableNodes(entries, visibilityCache).filter(({ node }) => isNotAGuard(node));
    if (!innerElements[0]) {
        innerElements = anyFocusable;
        if (!innerElements[0]) {
            return undefined;
        }
    }
    const outerNodes = getAllTabbableNodes([commonParent], visibilityCache).map(({ node }) => node);
    const orderedInnerElements = reorderNodes(outerNodes, innerElements);
    const innerNodes = orderedInnerElements.map(({ node }) => node);
    const newId = newFocus(innerNodes, outerNodes, activeElement, lastNode);
    if (newId === NEW_FOCUS) {
        const focusNode = pickAutofocus(anyFocusable, innerNodes, allParentAutofocusables(entries, visibilityCache));
        if (focusNode) {
            return { node: focusNode };
        }
        else {
            console.warn('focus-lock: cannot find any node to move focus into');
            return undefined;
        }
    }
    if (newId === undefined) {
        return newId;
    }
    return orderedInnerElements[newId];
};
