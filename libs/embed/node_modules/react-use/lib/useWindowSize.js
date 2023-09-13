"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useRafState_1 = tslib_1.__importDefault(require("./useRafState"));
var util_1 = require("./misc/util");
var useWindowSize = function (initialWidth, initialHeight) {
    if (initialWidth === void 0) { initialWidth = Infinity; }
    if (initialHeight === void 0) { initialHeight = Infinity; }
    var _a = useRafState_1.default({
        width: util_1.isBrowser ? window.innerWidth : initialWidth,
        height: util_1.isBrowser ? window.innerHeight : initialHeight,
    }), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        if (util_1.isBrowser) {
            var handler_1 = function () {
                setState({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };
            util_1.on(window, 'resize', handler_1);
            return function () {
                util_1.off(window, 'resize', handler_1);
            };
        }
    }, []);
    return state;
};
exports.default = useWindowSize;
