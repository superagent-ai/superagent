"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.correctNodes = exports.correctNode = void 0;
var is_1 = require("./is");
var findSelectedRadio = function (node, nodes) {
    return nodes
        .filter(is_1.isRadioElement)
        .filter(function (el) { return el.name === node.name; })
        .filter(function (el) { return el.checked; })[0] || node;
};
var correctNode = function (node, nodes) {
    if ((0, is_1.isRadioElement)(node) && node.name) {
        return findSelectedRadio(node, nodes);
    }
    return node;
};
exports.correctNode = correctNode;
/**
 * giving a set of radio inputs keeps only selected (tabbable) ones
 * @param nodes
 */
var correctNodes = function (nodes) {
    // IE11 has no Set(array) constructor
    var resultSet = new Set();
    nodes.forEach(function (node) { return resultSet.add((0, exports.correctNode)(node, nodes)); });
    // using filter to support IE11
    return nodes.filter(function (node) { return resultSet.has(node); });
};
exports.correctNodes = correctNodes;
