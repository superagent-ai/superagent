"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var util_1 = require("./misc/util");
exports.default = (function () {
    var _a = react_1.useState(0), mouseWheelScrolled = _a[0], setMouseWheelScrolled = _a[1];
    react_1.useEffect(function () {
        var updateScroll = function (e) {
            setMouseWheelScrolled(e.deltaY + mouseWheelScrolled);
        };
        util_1.on(window, 'wheel', updateScroll, false);
        return function () { return util_1.off(window, 'wheel', updateScroll); };
    });
    return mouseWheelScrolled;
});
