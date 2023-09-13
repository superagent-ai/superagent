"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var js_cookie_1 = tslib_1.__importDefault(require("js-cookie"));
var useCookie = function (cookieName) {
    var _a = react_1.useState(function () { return js_cookie_1.default.get(cookieName) || null; }), value = _a[0], setValue = _a[1];
    var updateCookie = react_1.useCallback(function (newValue, options) {
        js_cookie_1.default.set(cookieName, newValue, options);
        setValue(newValue);
    }, [cookieName]);
    var deleteCookie = react_1.useCallback(function () {
        js_cookie_1.default.remove(cookieName);
        setValue(null);
    }, [cookieName]);
    return [value, updateCookie, deleteCookie];
};
exports.default = useCookie;
