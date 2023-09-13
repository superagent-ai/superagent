import { useCallback, useEffect, useRef } from 'react';
export default function useTimeoutFn(fn, ms) {
    if (ms === void 0) { ms = 0; }
    var ready = useRef(false);
    var timeout = useRef();
    var callback = useRef(fn);
    var isReady = useCallback(function () { return ready.current; }, []);
    var set = useCallback(function () {
        ready.current = false;
        timeout.current && clearTimeout(timeout.current);
        timeout.current = setTimeout(function () {
            ready.current = true;
            callback.current();
        }, ms);
    }, [ms]);
    var clear = useCallback(function () {
        ready.current = null;
        timeout.current && clearTimeout(timeout.current);
    }, []);
    // update ref when function changes
    useEffect(function () {
        callback.current = fn;
    }, [fn]);
    // set on mount, clear on unmount
    useEffect(function () {
        set();
        return clear;
    }, [ms]);
    return [isReady, clear, set];
}
