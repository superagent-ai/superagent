"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var set_harmonic_interval_1 = require("set-harmonic-interval");
var useHarmonicIntervalFn = function (fn, delay) {
    if (delay === void 0) { delay = 0; }
    var latestCallback = react_1.useRef(function () { });
    react_1.useEffect(function () {
        latestCallback.current = fn;
    });
    react_1.useEffect(function () {
        if (delay !== null) {
            var interval_1 = set_harmonic_interval_1.setHarmonicInterval(function () { return latestCallback.current(); }, delay);
            return function () { return set_harmonic_interval_1.clearHarmonicInterval(interval_1); };
        }
        return undefined;
    }, [delay]);
};
exports.default = useHarmonicIntervalFn;
