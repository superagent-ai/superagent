"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useEffectOnce_1 = tslib_1.__importDefault(require("./useEffectOnce"));
var useUnmount = function (fn) {
    var fnRef = react_1.useRef(fn);
    // update the ref each render so if it change the newest callback will be invoked
    fnRef.current = fn;
    useEffectOnce_1.default(function () { return function () { return fnRef.current(); }; });
};
exports.default = useUnmount;
