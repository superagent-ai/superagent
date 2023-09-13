"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAffectedNodes = void 0;
var constants_1 = require("../constants");
var array_1 = require("./array");
/**
 * in case of multiple nodes nested inside each other
 * keeps only top ones
 * this is O(nlogn)
 * @param nodes
 * @returns {*}
 */
var filterNested = function (nodes) {
    var contained = new Set();
    var l = nodes.length;
    for (var i = 0; i < l; i += 1) {
        for (var j = i + 1; j < l; j += 1) {
            var position = nodes[i].compareDocumentPosition(nodes[j]);
            /* eslint-disable no-bitwise */
            if ((position & Node.DOCUMENT_POSITION_CONTAINED_BY) > 0) {
                contained.add(j);
            }
            if ((position & Node.DOCUMENT_POSITION_CONTAINS) > 0) {
                contained.add(i);
            }
            /* eslint-enable */
        }
    }
    return nodes.filter(function (_, index) { return !contained.has(index); });
};
/**
 * finds top most parent for a node
 * @param node
 * @returns {*}
 */
var getTopParent = function (node) {
    return node.parentNode ? getTopParent(node.parentNode) : node;
};
/**
 * returns all "focus containers" inside a given node
 * @param node
 * @returns {T}
 */
var getAllAffectedNodes = function (node) {
    var nodes = (0, array_1.asArray)(node);
    return nodes.filter(Boolean).reduce(function (acc, currentNode) {
        var group = currentNode.getAttribute(constants_1.FOCUS_GROUP);
        acc.push.apply(acc, (group
            ? filterNested((0, array_1.toArray)(getTopParent(currentNode).querySelectorAll("[".concat(constants_1.FOCUS_GROUP, "=\"").concat(group, "\"]:not([").concat(constants_1.FOCUS_DISABLED, "=\"disabled\"])"))))
            : [currentNode]));
        return acc;
    }, []);
};
exports.getAllAffectedNodes = getAllAffectedNodes;
