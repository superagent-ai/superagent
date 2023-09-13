import { useEffect, useRef } from 'react';
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
    var ref = useRef(undefined);
    if (!ref.current || !depsEqual(deps, ref.current)) {
        ref.current = deps;
    }
    useEffect(effect, ref.current);
};
export default useCustomCompareEffect;
