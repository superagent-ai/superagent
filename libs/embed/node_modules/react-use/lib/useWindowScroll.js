"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var util_1 = require("./misc/util");
var useRafState_1 = tslib_1.__importDefault(require("./useRafState"));
var useWindowScroll = function () {
    var _a = useRafState_1.default(function () { return ({
        x: util_1.isBrowser ? window.pageXOffset : 0,
        y: util_1.isBrowser ? window.pageYOffset : 0,
    }); }), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        var handler = function () {
            setState(function (state) {
                var pageXOffset = window.pageXOffset, pageYOffset = window.pageYOffset;
                //Check state for change, return same state if no change happened to prevent rerender
                //(see useState/setState documentation). useState/setState is used internally in useRafState/setState.
                return state.x !== pageXOffset || state.y !== pageYOffset
                    ? {
                        x: pageXOffset,
                        y: pageYOffset,
                    }
                    : state;
            });
        };
        //We have to update window scroll at mount, before subscription.
        //Window scroll may be changed between render and effect handler.
        handler();
        util_1.on(window, 'scroll', handler, {
            capture: false,
            passive: true,
        });
        return function () {
            util_1.off(window, 'scroll', handler);
        };
    }, []);
    return state;
};
exports.default = useWindowScroll;
