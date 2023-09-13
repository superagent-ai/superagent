"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var useTimeoutFn_1 = tslib_1.__importDefault(require("./useTimeoutFn"));
var useUpdate_1 = tslib_1.__importDefault(require("./useUpdate"));
function useTimeout(ms) {
    if (ms === void 0) { ms = 0; }
    var update = useUpdate_1.default();
    return useTimeoutFn_1.default(update, ms);
}
exports.default = useTimeout;
