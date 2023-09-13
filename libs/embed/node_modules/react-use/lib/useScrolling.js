"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var util_1 = require("./misc/util");
var useScrolling = function (ref) {
    var _a = react_1.useState(false), scrolling = _a[0], setScrolling = _a[1];
    react_1.useEffect(function () {
        if (ref.current) {
            var scrollingTimeout_1;
            var handleScrollEnd_1 = function () {
                setScrolling(false);
            };
            var handleScroll_1 = function () {
                setScrolling(true);
                clearTimeout(scrollingTimeout_1);
                scrollingTimeout_1 = setTimeout(function () { return handleScrollEnd_1(); }, 150);
            };
            util_1.on(ref.current, 'scroll', handleScroll_1, false);
            return function () {
                if (ref.current) {
                    util_1.off(ref.current, 'scroll', handleScroll_1, false);
                }
            };
        }
        return function () { };
    }, [ref]);
    return scrolling;
};
exports.default = useScrolling;
