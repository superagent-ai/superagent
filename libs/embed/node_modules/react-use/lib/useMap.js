"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useMap = function (initialMap) {
    if (initialMap === void 0) { initialMap = {}; }
    var _a = react_1.useState(initialMap), map = _a[0], set = _a[1];
    var stableActions = react_1.useMemo(function () { return ({
        set: function (key, entry) {
            set(function (prevMap) {
                var _a;
                return (tslib_1.__assign(tslib_1.__assign({}, prevMap), (_a = {}, _a[key] = entry, _a)));
            });
        },
        setAll: function (newMap) {
            set(newMap);
        },
        remove: function (key) {
            set(function (prevMap) {
                var _a = prevMap, _b = key, omit = _a[_b], rest = tslib_1.__rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                return rest;
            });
        },
        reset: function () { return set(initialMap); },
    }); }, [set]);
    var utils = tslib_1.__assign({ get: react_1.useCallback(function (key) { return map[key]; }, [map]) }, stableActions);
    return [map, utils];
};
exports.default = useMap;
