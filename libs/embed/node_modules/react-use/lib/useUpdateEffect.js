"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useFirstMountState_1 = require("./useFirstMountState");
var useUpdateEffect = function (effect, deps) {
    var isFirstMount = useFirstMountState_1.useFirstMountState();
    react_1.useEffect(function () {
        if (!isFirstMount) {
            return effect();
        }
    }, deps);
};
exports.default = useUpdateEffect;
