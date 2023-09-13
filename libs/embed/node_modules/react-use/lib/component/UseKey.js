"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var useKey_1 = tslib_1.__importDefault(require("../useKey"));
var createRenderProp_1 = tslib_1.__importDefault(require("../factory/createRenderProp"));
var UseKey = createRenderProp_1.default(useKey_1.default, function (_a) {
    var filter = _a.filter, fn = _a.fn, deps = _a.deps, rest = tslib_1.__rest(_a, ["filter", "fn", "deps"]);
    return [
        filter,
        fn,
        rest,
        deps,
    ];
});
exports.default = UseKey;
