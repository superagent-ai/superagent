import { useEffect, useRef, useState } from 'react';
import useUnmount from './useUnmount';
var useThrottle = function (value, ms) {
    if (ms === void 0) { ms = 200; }
    var _a = useState(value), state = _a[0], setState = _a[1];
    var timeout = useRef();
    var nextValue = useRef(null);
    var hasNextValue = useRef(0);
    useEffect(function () {
        if (!timeout.current) {
            setState(value);
            var timeoutCallback_1 = function () {
                if (hasNextValue.current) {
                    hasNextValue.current = false;
                    setState(nextValue.current);
                    timeout.current = setTimeout(timeoutCallback_1, ms);
                }
                else {
                    timeout.current = undefined;
                }
            };
            timeout.current = setTimeout(timeoutCallback_1, ms);
        }
        else {
            nextValue.current = value;
            hasNextValue.current = true;
        }
    }, [value]);
    useUnmount(function () {
        timeout.current && clearTimeout(timeout.current);
    });
    return state;
};
export default useThrottle;
