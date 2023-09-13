"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useInterval = function (callback, delay) {
    var savedCallback = react_1.useRef(function () { });
    react_1.useEffect(function () {
        savedCallback.current = callback;
    });
    react_1.useEffect(function () {
        if (delay !== null) {
            var interval_1 = setInterval(function () { return savedCallback.current(); }, delay || 0);
            return function () { return clearInterval(interval_1); };
        }
        return undefined;
    }, [delay]);
};
exports.default = useInterval;
