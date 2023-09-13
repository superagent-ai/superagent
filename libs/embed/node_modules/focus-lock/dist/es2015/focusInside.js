import { contains } from './utils/DOMutils';
import { getAllAffectedNodes } from './utils/all-affected';
import { getFirst, toArray } from './utils/array';
import { getActiveElement } from './utils/getActiveElement';
var focusInFrame = function (frame, activeElement) { return frame === activeElement; };
var focusInsideIframe = function (topNode, activeElement) {
    return Boolean(toArray(topNode.querySelectorAll('iframe')).some(function (node) { return focusInFrame(node, activeElement); }));
};
/**
 * @returns {Boolean} true, if the current focus is inside given node or nodes
 */
export var focusInside = function (topNode, activeElement) {
    // const activeElement = document && getActiveElement();
    if (activeElement === void 0) { activeElement = getActiveElement(getFirst(topNode).ownerDocument); }
    if (!activeElement || (activeElement.dataset && activeElement.dataset.focusGuard)) {
        return false;
    }
    return getAllAffectedNodes(topNode).some(function (node) {
        return contains(node, activeElement) || focusInsideIframe(node, activeElement);
    });
};
