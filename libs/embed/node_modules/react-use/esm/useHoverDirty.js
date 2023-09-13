import { useEffect, useState } from 'react';
import { off, on } from './misc/util';
// kudos: https://usehooks.com/
var useHoverDirty = function (ref, enabled) {
    if (enabled === void 0) { enabled = true; }
    if (process.env.NODE_ENV === 'development') {
        if (typeof ref !== 'object' || typeof ref.current === 'undefined') {
            console.error('useHoverDirty expects a single ref argument.');
        }
    }
    var _a = useState(false), value = _a[0], setValue = _a[1];
    useEffect(function () {
        var onMouseOver = function () { return setValue(true); };
        var onMouseOut = function () { return setValue(false); };
        if (enabled && ref && ref.current) {
            on(ref.current, 'mouseover', onMouseOver);
            on(ref.current, 'mouseout', onMouseOut);
        }
        // fixes react-hooks/exhaustive-deps warning about stale ref elements
        var current = ref.current;
        return function () {
            if (enabled && current) {
                off(current, 'mouseover', onMouseOver);
                off(current, 'mouseout', onMouseOut);
            }
        };
    }, [enabled, ref]);
    return value;
};
export default useHoverDirty;
