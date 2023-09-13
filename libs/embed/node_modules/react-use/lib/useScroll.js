"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useRafState_1 = tslib_1.__importDefault(require("./useRafState"));
var util_1 = require("./misc/util");
var useScroll = function (ref) {
    if (process.env.NODE_ENV === 'development') {
        if (typeof ref !== 'object' || typeof ref.current === 'undefined') {
            console.error('`useScroll` expects a single ref argument.');
        }
    }
    var _a = useRafState_1.default({
        x: 0,
        y: 0,
    }), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        var handler = function () {
            if (ref.current) {
                setState({
                    x: ref.current.scrollLeft,
                    y: ref.current.scrollTop,
                });
            }
        };
        if (ref.current) {
            util_1.on(ref.current, 'scroll', handler, {
                capture: false,
                passive: true,
            });
        }
        return function () {
            if (ref.current) {
                util_1.off(ref.current, 'scroll', handler);
            }
        };
    }, [ref]);
    return state;
};
exports.default = useScroll;
