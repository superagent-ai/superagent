"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var useCustomCompareEffect_1 = tslib_1.__importDefault(require("./useCustomCompareEffect"));
var isDeepEqual_1 = tslib_1.__importDefault(require("./misc/isDeepEqual"));
var isPrimitive = function (val) { return val !== Object(val); };
var useDeepCompareEffect = function (effect, deps) {
    if (process.env.NODE_ENV !== 'production') {
        if (!(deps instanceof Array) || !deps.length) {
            console.warn('`useDeepCompareEffect` should not be used with no dependencies. Use React.useEffect instead.');
        }
        if (deps.every(isPrimitive)) {
            console.warn('`useDeepCompareEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead.');
        }
    }
    useCustomCompareEffect_1.default(effect, deps, isDeepEqual_1.default);
};
exports.default = useDeepCompareEffect;
