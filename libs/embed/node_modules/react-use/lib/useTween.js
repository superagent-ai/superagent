"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts_easing_1 = require("ts-easing");
var useRaf_1 = tslib_1.__importDefault(require("./useRaf"));
var useTween = function (easingName, ms, delay) {
    if (easingName === void 0) { easingName = 'inCirc'; }
    if (ms === void 0) { ms = 200; }
    if (delay === void 0) { delay = 0; }
    var fn = ts_easing_1.easing[easingName];
    var t = useRaf_1.default(ms, delay);
    if (process.env.NODE_ENV !== 'production') {
        if (typeof fn !== 'function') {
            console.error('useTween() expected "easingName" property to be a valid easing function name, like:' +
                '"' +
                Object.keys(ts_easing_1.easing).join('", "') +
                '".');
            console.trace();
            return 0;
        }
    }
    return fn(t);
};
exports.default = useTween;
