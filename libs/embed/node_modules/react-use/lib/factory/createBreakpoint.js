"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var util_1 = require("../misc/util");
var createBreakpoint = function (breakpoints) {
    if (breakpoints === void 0) { breakpoints = { laptopL: 1440, laptop: 1024, tablet: 768 }; }
    return function () {
        var _a = react_1.useState(util_1.isBrowser ? window.innerWidth : 0), screen = _a[0], setScreen = _a[1];
        react_1.useEffect(function () {
            var setSideScreen = function () {
                setScreen(window.innerWidth);
            };
            setSideScreen();
            util_1.on(window, 'resize', setSideScreen);
            return function () {
                util_1.off(window, 'resize', setSideScreen);
            };
        });
        var sortedBreakpoints = react_1.useMemo(function () { return Object.entries(breakpoints).sort(function (a, b) { return (a[1] >= b[1] ? 1 : -1); }); }, [breakpoints]);
        var result = sortedBreakpoints.reduce(function (acc, _a) {
            var name = _a[0], width = _a[1];
            if (screen >= width) {
                return name;
            }
            else {
                return acc;
            }
        }, sortedBreakpoints[0][0]);
        return result;
    };
};
exports.default = createBreakpoint;
