"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var copy_to_clipboard_1 = tslib_1.__importDefault(require("copy-to-clipboard"));
var react_1 = require("react");
var useMountedState_1 = tslib_1.__importDefault(require("./useMountedState"));
var useSetState_1 = tslib_1.__importDefault(require("./useSetState"));
var useCopyToClipboard = function () {
    var isMounted = useMountedState_1.default();
    var _a = useSetState_1.default({
        value: undefined,
        error: undefined,
        noUserInteraction: true,
    }), state = _a[0], setState = _a[1];
    var copyToClipboard = react_1.useCallback(function (value) {
        if (!isMounted()) {
            return;
        }
        var noUserInteraction;
        var normalizedValue;
        try {
            // only strings and numbers casted to strings can be copied to clipboard
            if (typeof value !== 'string' && typeof value !== 'number') {
                var error = new Error("Cannot copy typeof " + typeof value + " to clipboard, must be a string");
                if (process.env.NODE_ENV === 'development')
                    console.error(error);
                setState({
                    value: value,
                    error: error,
                    noUserInteraction: true,
                });
                return;
            }
            // empty strings are also considered invalid
            else if (value === '') {
                var error = new Error("Cannot copy empty string to clipboard.");
                if (process.env.NODE_ENV === 'development')
                    console.error(error);
                setState({
                    value: value,
                    error: error,
                    noUserInteraction: true,
                });
                return;
            }
            normalizedValue = value.toString();
            noUserInteraction = copy_to_clipboard_1.default(normalizedValue);
            setState({
                value: normalizedValue,
                error: undefined,
                noUserInteraction: noUserInteraction,
            });
        }
        catch (error) {
            setState({
                value: normalizedValue,
                error: error,
                noUserInteraction: noUserInteraction,
            });
        }
    }, []);
    return [state, copyToClipboard];
};
exports.default = useCopyToClipboard;
