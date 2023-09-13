"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var useEffectOnce_1 = tslib_1.__importDefault(require("./useEffectOnce"));
var useUpdateEffect_1 = tslib_1.__importDefault(require("./useUpdateEffect"));
var useLogger = function (componentName) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    useEffectOnce_1.default(function () {
        console.log.apply(console, tslib_1.__spreadArrays([componentName + " mounted"], rest));
        return function () { return console.log(componentName + " unmounted"); };
    });
    useUpdateEffect_1.default(function () {
        console.log.apply(console, tslib_1.__spreadArrays([componentName + " updated"], rest));
    });
};
exports.default = useLogger;
