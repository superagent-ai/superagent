"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var isPrimitive = function (val) { return val !== Object(val); };
var useCustomCompareEffect = function (effect, deps, depsEqual) {
    if (process.env.NODE_ENV !== 'production') {
        if (!(deps instanceof Array) || !deps.length) {
            console.warn('`useCustomCompareEffect` should not be used with no dependencies. Use React.useEffect instead.');
        }
        if (deps.every(isPrimitive)) {
            console.warn('`useCustomCompareEffect` should not be used with dependencies that are all primitive values. Use React.useEffect instead.');
        }
        if (typeof depsEqual !== 'function') {
            console.warn('`useCustomCompareEffect` should be used with depsEqual callback for comparing deps list');
        }
    }
    var ref = react_1.useRef(undefined);
    if (!ref.current || !depsEqual(deps, ref.current)) {
        ref.current = deps;
    }
    react_1.useEffect(effect, ref.current);
};
exports.default = useCustomCompareEffect;
