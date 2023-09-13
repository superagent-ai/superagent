"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.focusInside = void 0;
var DOMutils_1 = require("./utils/DOMutils");
var all_affected_1 = require("./utils/all-affected");
var array_1 = require("./utils/array");
var getActiveElement_1 = require("./utils/getActiveElement");
var focusInFrame = function (frame, activeElement) { return frame === activeElement; };
var focusInsideIframe = function (topNode, activeElement) {
    return Boolean((0, array_1.toArray)(topNode.querySelectorAll('iframe')).some(function (node) { return focusInFrame(node, activeElement); }));
};
/**
 * @returns {Boolean} true, if the current focus is inside given node or nodes
 */
var focusInside = function (topNode, activeElement) {
    // const activeElement = document && getActiveElement();
    if (activeElement === void 0) { activeElement = (0, getActiveElement_1.getActiveElement)((0, array_1.getFirst)(topNode).ownerDocument); }
    if (!activeElement || (activeElement.dataset && activeElement.dataset.focusGuard)) {
        return false;
    }
    return (0, all_affected_1.getAllAffectedNodes)(topNode).some(function (node) {
        return (0, DOMutils_1.contains)(node, activeElement) || focusInsideIframe(node, activeElement);
    });
};
exports.focusInside = focusInside;
