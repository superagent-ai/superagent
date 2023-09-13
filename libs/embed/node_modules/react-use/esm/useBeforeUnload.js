import { useCallback, useEffect } from 'react';
import { off, on } from './misc/util';
var useBeforeUnload = function (enabled, message) {
    if (enabled === void 0) { enabled = true; }
    var handler = useCallback(function (event) {
        var finalEnabled = typeof enabled === 'function' ? enabled() : true;
        if (!finalEnabled) {
            return;
        }
        event.preventDefault();
        if (message) {
            event.returnValue = message;
        }
        return message;
    }, [enabled, message]);
    useEffect(function () {
        if (!enabled) {
            return;
        }
        on(window, 'beforeunload', handler);
        return function () { return off(window, 'beforeunload', handler); };
    }, [enabled, handler]);
};
export default useBeforeUnload;
