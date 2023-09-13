"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFocusableIn = exports.getFocusabledIn = void 0;
var DOMutils_1 = require("./utils/DOMutils");
var all_affected_1 = require("./utils/all-affected");
var is_1 = require("./utils/is");
var parenting_1 = require("./utils/parenting");
/**
 * return list of focusable elements inside a given top node
 * @deprecated use {@link getFocusableIn}. Yep, there is typo in the function name
 */
var getFocusabledIn = function (topNode) {
    var entries = (0, all_affected_1.getAllAffectedNodes)(topNode).filter(is_1.isNotAGuard);
    var commonParent = (0, parenting_1.getTopCommonParent)(topNode, topNode, entries);
    var visibilityCache = new Map();
    var outerNodes = (0, DOMutils_1.getTabbableNodes)([commonParent], visibilityCache, true);
    var innerElements = (0, DOMutils_1.getTabbableNodes)(entries, visibilityCache)
        .filter(function (_a) {
        var node = _a.node;
        return (0, is_1.isNotAGuard)(node);
    })
        .map(function (_a) {
        var node = _a.node;
        return node;
    });
    return outerNodes.map(function (_a) {
        var node = _a.node, index = _a.index;
        return ({
            node: node,
            index: index,
            lockItem: innerElements.indexOf(node) >= 0,
            guard: (0, is_1.isGuard)(node),
        });
    });
};
exports.getFocusabledIn = getFocusabledIn;
/**
 * return list of focusable elements inside a given top node
 */
exports.getFocusableIn = exports.getFocusabledIn;
