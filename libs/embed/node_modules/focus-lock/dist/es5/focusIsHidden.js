"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.focusIsHidden = void 0;
var constants_1 = require("./constants");
var DOMutils_1 = require("./utils/DOMutils");
var array_1 = require("./utils/array");
var getActiveElement_1 = require("./utils/getActiveElement");
/**
 * focus is hidden FROM the focus-lock
 * ie contained inside a node focus-lock shall ignore
 * @returns {boolean} focus is currently is in "allow" area
 */
var focusIsHidden = function (inDocument) {
    if (inDocument === void 0) { inDocument = document; }
    var activeElement = (0, getActiveElement_1.getActiveElement)(inDocument);
    if (!activeElement) {
        return false;
    }
    // this does not support setting FOCUS_ALLOW within shadow dom
    return (0, array_1.toArray)(inDocument.querySelectorAll("[".concat(constants_1.FOCUS_ALLOW, "]"))).some(function (node) { return (0, DOMutils_1.contains)(node, activeElement); });
};
exports.focusIsHidden = focusIsHidden;
