import { __assign, __spreadArrays } from "tslib";
import { useCallback, useMemo, useState } from 'react';
var useSet = function (initialSet) {
    if (initialSet === void 0) { initialSet = new Set(); }
    var _a = useState(initialSet), set = _a[0], setSet = _a[1];
    var stableActions = useMemo(function () {
        var add = function (item) { return setSet(function (prevSet) { return new Set(__spreadArrays(Array.from(prevSet), [item])); }); };
        var remove = function (item) {
            return setSet(function (prevSet) { return new Set(Array.from(prevSet).filter(function (i) { return i !== item; })); });
        };
        var toggle = function (item) {
            return setSet(function (prevSet) {
                return prevSet.has(item)
                    ? new Set(Array.from(prevSet).filter(function (i) { return i !== item; }))
                    : new Set(__spreadArrays(Array.from(prevSet), [item]));
            });
        };
        return { add: add, remove: remove, toggle: toggle, reset: function () { return setSet(initialSet); } };
    }, [setSet]);
    var utils = __assign({ has: useCallback(function (item) { return set.has(item); }, [set]) }, stableActions);
    return [set, utils];
};
export default useSet;
