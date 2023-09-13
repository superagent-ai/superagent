import { useEffect, useRef, useState } from 'react';
import useUnmount from './useUnmount';
var useThrottleFn = function (fn, ms, args) {
    if (ms === void 0) { ms = 200; }
    var _a = useState(null), state = _a[0], setState = _a[1];
    var timeout = useRef();
    var nextArgs = useRef();
    useEffect(function () {
        if (!timeout.current) {
            setState(fn.apply(void 0, args));
            var timeoutCallback_1 = function () {
                if (nextArgs.current) {
                    setState(fn.apply(void 0, nextArgs.current));
                    nextArgs.current = undefined;
                    timeout.current = setTimeout(timeoutCallback_1, ms);
                }
                else {
                    timeout.current = undefined;
                }
            };
            timeout.current = setTimeout(timeoutCallback_1, ms);
        }
        else {
            nextArgs.current = args;
        }
    }, args);
    useUnmount(function () {
        timeout.current && clearTimeout(timeout.current);
    });
    return state;
};
export default useThrottleFn;
