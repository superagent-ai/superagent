import { __spreadArrays } from "tslib";
import useEffectOnce from './useEffectOnce';
import useUpdateEffect from './useUpdateEffect';
var useLogger = function (componentName) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    useEffectOnce(function () {
        console.log.apply(console, __spreadArrays([componentName + " mounted"], rest));
        return function () { return console.log(componentName + " unmounted"); };
    });
    useUpdateEffect(function () {
        console.log.apply(console, __spreadArrays([componentName + " updated"], rest));
    });
};
export default useLogger;
