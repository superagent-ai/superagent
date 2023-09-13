"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useSet = function (initialSet) {
    if (initialSet === void 0) { initialSet = new Set(); }
    var _a = react_1.useState(initialSet), set = _a[0], setSet = _a[1];
    var stableActions = react_1.useMemo(function () {
        var add = function (item) { return setSet(function (prevSet) { return new Set(tslib_1.__spreadArrays(Array.from(prevSet), [item])); }); };
        var remove = function (item) {
            return setSet(function (prevSet) { return new Set(Array.from(prevSet).filter(function (i) { return i !== item; })); });
        };
        var toggle = function (item) {
            return setSet(function (prevSet) {
                return prevSet.has(item)
                    ? new Set(Array.from(prevSet).filter(function (i) { return i !== item; }))
                    : new Set(tslib_1.__spreadArrays(Array.from(prevSet), [item]));
            });
        };
        return { add: add, remove: remove, toggle: toggle, reset: function () { return setSet(initialSet); } };
    }, [setSet]);
    var utils = tslib_1.__assign({ has: react_1.useCallback(function (item) { return set.has(item); }, [set]) }, stableActions);
    return [set, utils];
};
exports.default = useSet;
