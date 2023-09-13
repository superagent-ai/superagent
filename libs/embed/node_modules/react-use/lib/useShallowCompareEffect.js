"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fast_shallow_equal_1 = require("fast-shallow-equal");
var useCustomCompareEffect_1 = tslib_1.__importDefault(require("./useCustomCompareEffect"));
var isPrimitive = function (val) { return val !== Object(val); };
var shallowEqualDepsList = function (prevDeps, nextDeps) {
    return prevDeps.every(function (dep, index) { return fast_shallow_equal_1.equal(dep, nextDeps[index]); });
};
var useShallowCompareEffect = function (effect, deps) {
    if (process.env.NODE_ENV !== 'production') {
        if (!(deps instanceof Array) || !deps.length) {
            console.warn('`useShallowCompareEffect` should not be used with no dependencies. Use React.useEffect instead.');
        }
        if (deps.every(isPrimitive)) {
            console.warn('`useShallowCompareEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead.');
        }
    }
    useCustomCompareEffect_1.default(effect, deps, shallowEqualDepsList);
};
exports.default = useShallowCompareEffect;
