"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useAsync_1 = tslib_1.__importDefault(require("./useAsync"));
var useAsyncRetry = function (fn, deps) {
    if (deps === void 0) { deps = []; }
    var _a = react_1.useState(0), attempt = _a[0], setAttempt = _a[1];
    var state = useAsync_1.default(fn, tslib_1.__spreadArrays(deps, [attempt]));
    var stateLoading = state.loading;
    var retry = react_1.useCallback(function () {
        if (stateLoading) {
            if (process.env.NODE_ENV === 'development') {
                console.log('You are calling useAsyncRetry hook retry() method while loading in progress, this is a no-op.');
            }
            return;
        }
        setAttempt(function (currentAttempt) { return currentAttempt + 1; });
    }, tslib_1.__spreadArrays(deps, [stateLoading]));
    return tslib_1.__assign(tslib_1.__assign({}, state), { retry: retry });
};
exports.default = useAsyncRetry;
