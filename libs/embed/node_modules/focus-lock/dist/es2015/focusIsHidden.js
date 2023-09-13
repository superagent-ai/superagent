import { FOCUS_ALLOW } from './constants';
import { contains } from './utils/DOMutils';
import { toArray } from './utils/array';
import { getActiveElement } from './utils/getActiveElement';
/**
 * focus is hidden FROM the focus-lock
 * ie contained inside a node focus-lock shall ignore
 * @returns {boolean} focus is currently is in "allow" area
 */
export var focusIsHidden = function (inDocument) {
    if (inDocument === void 0) { inDocument = document; }
    var activeElement = getActiveElement(inDocument);
    if (!activeElement) {
        return false;
    }
    // this does not support setting FOCUS_ALLOW within shadow dom
    return toArray(inDocument.querySelectorAll("[".concat(FOCUS_ALLOW, "]"))).some(function (node) { return contains(node, activeElement); });
};
