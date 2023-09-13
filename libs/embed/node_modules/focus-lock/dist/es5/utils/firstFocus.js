"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickFocusable = exports.pickFirstFocus = void 0;
var correctFocus_1 = require("./correctFocus");
var pickFirstFocus = function (nodes) {
    if (nodes[0] && nodes.length > 1) {
        return (0, correctFocus_1.correctNode)(nodes[0], nodes);
    }
    return nodes[0];
};
exports.pickFirstFocus = pickFirstFocus;
var pickFocusable = function (nodes, index) {
    if (nodes.length > 1) {
        return nodes.indexOf((0, correctFocus_1.correctNode)(nodes[index], nodes));
    }
    return index;
};
exports.pickFocusable = pickFocusable;
