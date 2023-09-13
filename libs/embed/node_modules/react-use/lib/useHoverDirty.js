"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var util_1 = require("./misc/util");
// kudos: https://usehooks.com/
var useHoverDirty = function (ref, enabled) {
    if (enabled === void 0) { enabled = true; }
    if (process.env.NODE_ENV === 'development') {
        if (typeof ref !== 'object' || typeof ref.current === 'undefined') {
            console.error('useHoverDirty expects a single ref argument.');
        }
    }
    var _a = react_1.useState(false), value = _a[0], setValue = _a[1];
    react_1.useEffect(function () {
        var onMouseOver = function () { return setValue(true); };
        var onMouseOut = function () { return setValue(false); };
        if (enabled && ref && ref.current) {
            util_1.on(ref.current, 'mouseover', onMouseOver);
            util_1.on(ref.current, 'mouseout', onMouseOut);
        }
        // fixes react-hooks/exhaustive-deps warning about stale ref elements
        var current = ref.current;
        return function () {
            if (enabled && current) {
                util_1.off(current, 'mouseover', onMouseOver);
                util_1.off(current, 'mouseout', onMouseOut);
            }
        };
    }, [enabled, ref]);
    return value;
};
exports.default = useHoverDirty;
