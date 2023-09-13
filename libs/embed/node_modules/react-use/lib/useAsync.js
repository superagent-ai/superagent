"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useAsyncFn_1 = tslib_1.__importDefault(require("./useAsyncFn"));
function useAsync(fn, deps) {
    if (deps === void 0) { deps = []; }
    var _a = useAsyncFn_1.default(fn, deps, {
        loading: true,
    }), state = _a[0], callback = _a[1];
    react_1.useEffect(function () {
        callback();
    }, [callback]);
    return state;
}
exports.default = useAsync;
