"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useUnmount_1 = tslib_1.__importDefault(require("./useUnmount"));
var useRafState = function (initialState) {
    var frame = react_1.useRef(0);
    var _a = react_1.useState(initialState), state = _a[0], setState = _a[1];
    var setRafState = react_1.useCallback(function (value) {
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(function () {
            setState(value);
        });
    }, []);
    useUnmount_1.default(function () {
        cancelAnimationFrame(frame.current);
    });
    return [state, setRafState];
};
exports.default = useRafState;
