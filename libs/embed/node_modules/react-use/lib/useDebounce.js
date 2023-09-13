"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useTimeoutFn_1 = tslib_1.__importDefault(require("./useTimeoutFn"));
function useDebounce(fn, ms, deps) {
    if (ms === void 0) { ms = 0; }
    if (deps === void 0) { deps = []; }
    var _a = useTimeoutFn_1.default(fn, ms), isReady = _a[0], cancel = _a[1], reset = _a[2];
    react_1.useEffect(reset, deps);
    return [isReady, cancel];
}
exports.default = useDebounce;
