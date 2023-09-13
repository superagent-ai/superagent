"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var util_1 = require("./misc/util");
var useBeforeUnload = function (enabled, message) {
    if (enabled === void 0) { enabled = true; }
    var handler = react_1.useCallback(function (event) {
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
    react_1.useEffect(function () {
        if (!enabled) {
            return;
        }
        util_1.on(window, 'beforeunload', handler);
        return function () { return util_1.off(window, 'beforeunload', handler); };
    }, [enabled, handler]);
};
exports.default = useBeforeUnload;
