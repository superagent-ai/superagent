"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var useEffectOnce_1 = tslib_1.__importDefault(require("./useEffectOnce"));
var useMount = function (fn) {
    useEffectOnce_1.default(function () {
        fn();
    });
};
exports.default = useMount;
