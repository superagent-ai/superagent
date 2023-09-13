import { __assign, __rest } from "tslib";
import { useCallback, useMemo, useState } from 'react';
var useMap = function (initialMap) {
    if (initialMap === void 0) { initialMap = {}; }
    var _a = useState(initialMap), map = _a[0], set = _a[1];
    var stableActions = useMemo(function () { return ({
        set: function (key, entry) {
            set(function (prevMap) {
                var _a;
                return (__assign(__assign({}, prevMap), (_a = {}, _a[key] = entry, _a)));
            });
        },
        setAll: function (newMap) {
            set(newMap);
        },
        remove: function (key) {
            set(function (prevMap) {
                var _a = prevMap, _b = key, omit = _a[_b], rest = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                return rest;
            });
        },
        reset: function () { return set(initialMap); },
    }); }, [set]);
    var utils = __assign({ get: useCallback(function (key) { return map[key]; }, [map]) }, stableActions);
    return [map, utils];
};
export default useMap;
