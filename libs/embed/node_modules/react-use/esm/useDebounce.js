import { useEffect } from 'react';
import useTimeoutFn from './useTimeoutFn';
export default function useDebounce(fn, ms, deps) {
    if (ms === void 0) { ms = 0; }
    if (deps === void 0) { deps = []; }
    var _a = useTimeoutFn(fn, ms), isReady = _a[0], cancel = _a[1], reset = _a[2];
    useEffect(reset, deps);
    return [isReady, cancel];
}
