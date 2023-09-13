import { __spreadArrays } from "tslib";
import { useState } from 'react';
var useQueue = function (initialValue) {
    if (initialValue === void 0) { initialValue = []; }
    var _a = useState(initialValue), state = _a[0], set = _a[1];
    return {
        add: function (value) {
            set(function (queue) { return __spreadArrays(queue, [value]); });
        },
        remove: function () {
            var result;
            set(function (_a) {
                var first = _a[0], rest = _a.slice(1);
                result = first;
                return rest;
            });
            return result;
        },
        get first() {
            return state[0];
        },
        get last() {
            return state[state.length - 1];
        },
        get size() {
            return state.length;
        },
    };
};
export default useQueue;
