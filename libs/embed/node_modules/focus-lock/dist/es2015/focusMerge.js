import { NEW_FOCUS, newFocus } from './solver';
import { getAllTabbableNodes, getTabbableNodes } from './utils/DOMutils';
import { getAllAffectedNodes } from './utils/all-affected';
import { asArray, getFirst } from './utils/array';
import { pickAutofocus } from './utils/auto-focus';
import { getActiveElement } from './utils/getActiveElement';
import { isDefined, isNotAGuard } from './utils/is';
import { allParentAutofocusables, getTopCommonParent } from './utils/parenting';
var reorderNodes = function (srcNodes, dstNodes) {
    var remap = new Map();
    // no Set(dstNodes) for IE11 :(
    dstNodes.forEach(function (entity) { return remap.set(entity.node, entity); });
    // remap to dstNodes
    return srcNodes.map(function (node) { return remap.get(node); }).filter(isDefined);
};
/**
 * given top node(s) and the last active element return the element to be focused next
 * @param topNode
 * @param lastNode
 */
export var getFocusMerge = function (topNode, lastNode) {
    var activeElement = getActiveElement(asArray(topNode).length > 0 ? document : getFirst(topNode).ownerDocument);
    var entries = getAllAffectedNodes(topNode).filter(isNotAGuard);
    var commonParent = getTopCommonParent(activeElement || topNode, topNode, entries);
    var visibilityCache = new Map();
    var anyFocusable = getAllTabbableNodes(entries, visibilityCache);
    var innerElements = getTabbableNodes(entries, visibilityCache).filter(function (_a) {
        var node = _a.node;
        return isNotAGuard(node);
    });
    if (!innerElements[0]) {
        innerElements = anyFocusable;
        if (!innerElements[0]) {
            return undefined;
        }
    }
    var outerNodes = getAllTabbableNodes([commonParent], visibilityCache).map(function (_a) {
        var node = _a.node;
        return node;
    });
    var orderedInnerElements = reorderNodes(outerNodes, innerElements);
    var innerNodes = orderedInnerElements.map(function (_a) {
        var node = _a.node;
        return node;
    });
    var newId = newFocus(innerNodes, outerNodes, activeElement, lastNode);
    if (newId === NEW_FOCUS) {
        var focusNode = pickAutofocus(anyFocusable, innerNodes, allParentAutofocusables(entries, visibilityCache));
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
