import { contains } from './utils/DOMutils';
import { getAllAffectedNodes } from './utils/all-affected';
import { getFirst, toArray } from './utils/array';
import { getActiveElement } from './utils/getActiveElement';
const focusInFrame = (frame, activeElement) => frame === activeElement;
const focusInsideIframe = (topNode, activeElement) => Boolean(toArray(topNode.querySelectorAll('iframe')).some((node) => focusInFrame(node, activeElement)));
/**
 * @returns {Boolean} true, if the current focus is inside given node or nodes
 */
export const focusInside = (topNode, activeElement = getActiveElement(getFirst(topNode).ownerDocument)) => {
    // const activeElement = document && getActiveElement();
    if (!activeElement || (activeElement.dataset && activeElement.dataset.focusGuard)) {
        return false;
    }
    return getAllAffectedNodes(topNode).some((node) => {
        return contains(node, activeElement) || focusInsideIframe(node, activeElement);
    });
};
