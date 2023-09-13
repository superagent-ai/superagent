"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderByTabIndex = exports.tabSort = void 0;
var array_1 = require("./array");
var tabSort = function (a, b) {
    var tabDiff = a.tabIndex - b.tabIndex;
    var indexDiff = a.index - b.index;
    if (tabDiff) {
        if (!a.tabIndex) {
            return 1;
        }
        if (!b.tabIndex) {
            return -1;
        }
    }
    return tabDiff || indexDiff;
};
exports.tabSort = tabSort;
var orderByTabIndex = function (nodes, filterNegative, keepGuards) {
    return (0, array_1.toArray)(nodes)
        .map(function (node, index) { return ({
        node: node,
        index: index,
        tabIndex: keepGuards && node.tabIndex === -1 ? ((node.dataset || {}).focusGuard ? 0 : -1) : node.tabIndex,
    }); })
        .filter(function (data) { return !filterNegative || data.tabIndex >= 0; })
        .sort(exports.tabSort);
};
exports.orderByTabIndex = orderByTabIndex;
