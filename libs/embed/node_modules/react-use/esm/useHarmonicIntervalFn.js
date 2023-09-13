import { useEffect, useRef } from 'react';
import { clearHarmonicInterval, setHarmonicInterval } from 'set-harmonic-interval';
var useHarmonicIntervalFn = function (fn, delay) {
    if (delay === void 0) { delay = 0; }
    var latestCallback = useRef(function () { });
    useEffect(function () {
        latestCallback.current = fn;
    });
    useEffect(function () {
        if (delay !== null) {
            var interval_1 = setHarmonicInterval(function () { return latestCallback.current(); }, delay);
            return function () { return clearHarmonicInterval(interval_1); };
        }
        return undefined;
    }, [delay]);
};
export default useHarmonicIntervalFn;
