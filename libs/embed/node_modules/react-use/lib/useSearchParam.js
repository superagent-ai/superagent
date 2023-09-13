"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var util_1 = require("./misc/util");
var getValue = function (search, param) { return new URLSearchParams(search).get(param); };
var useSearchParam = function (param) {
    var location = window.location;
    var _a = react_1.useState(function () { return getValue(location.search, param); }), value = _a[0], setValue = _a[1];
    react_1.useEffect(function () {
        var onChange = function () {
            setValue(getValue(location.search, param));
        };
        util_1.on(window, 'popstate', onChange);
        util_1.on(window, 'pushstate', onChange);
        util_1.on(window, 'replacestate', onChange);
        return function () {
            util_1.off(window, 'popstate', onChange);
            util_1.off(window, 'pushstate', onChange);
            util_1.off(window, 'replacestate', onChange);
        };
    }, []);
    return value;
};
var useSearchParamServer = function () { return null; };
exports.default = util_1.isBrowser ? useSearchParam : useSearchParamServer;
