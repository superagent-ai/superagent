import { equal as isShallowEqual } from 'fast-shallow-equal';
import useCustomCompareEffect from './useCustomCompareEffect';
var isPrimitive = function (val) { return val !== Object(val); };
var shallowEqualDepsList = function (prevDeps, nextDeps) {
    return prevDeps.every(function (dep, index) { return isShallowEqual(dep, nextDeps[index]); });
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
    useCustomCompareEffect(effect, deps, shallowEqualDepsList);
};
export default useShallowCompareEffect;
