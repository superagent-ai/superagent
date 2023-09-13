import { useEffect, useRef } from 'react';
var useInterval = function (callback, delay) {
    var savedCallback = useRef(function () { });
    useEffect(function () {
        savedCallback.current = callback;
    });
    useEffect(function () {
        if (delay !== null) {
            var interval_1 = setInterval(function () { return savedCallback.current(); }, delay || 0);
            return function () { return clearInterval(interval_1); };
        }
        return undefined;
    }, [delay]);
};
export default useInterval;
