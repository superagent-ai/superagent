"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickAutofocus = void 0;
var DOMutils_1 = require("./DOMutils");
var firstFocus_1 = require("./firstFocus");
var is_1 = require("./is");
var findAutoFocused = function (autoFocusables) {
    return function (node) {
        var _a;
        var autofocus = (_a = (0, is_1.getDataset)(node)) === null || _a === void 0 ? void 0 : _a.autofocus;
        return (
        // @ts-expect-error
        node.autofocus ||
            //
            (autofocus !== undefined && autofocus !== 'false') ||
            //
            autoFocusables.indexOf(node) >= 0);
    };
};
var pickAutofocus = function (nodesIndexes, orderedNodes, groups) {
    var nodes = nodesIndexes.map(function (_a) {
        var node = _a.node;
        return node;
    });
    var autoFocusable = (0, DOMutils_1.filterAutoFocusable)(nodes.filter(findAutoFocused(groups)));
    if (autoFocusable && autoFocusable.length) {
        return (0, firstFocus_1.pickFirstFocus)(autoFocusable);
    }
    return (0, firstFocus_1.pickFirstFocus)((0, DOMutils_1.filterAutoFocusable)(orderedNodes));
};
exports.pickAutofocus = pickAutofocus;
