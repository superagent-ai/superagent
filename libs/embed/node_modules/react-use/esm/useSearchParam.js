import { useEffect, useState } from 'react';
import { isBrowser, off, on } from './misc/util';
var getValue = function (search, param) { return new URLSearchParams(search).get(param); };
var useSearchParam = function (param) {
    var location = window.location;
    var _a = useState(function () { return getValue(location.search, param); }), value = _a[0], setValue = _a[1];
    useEffect(function () {
        var onChange = function () {
            setValue(getValue(location.search, param));
        };
        on(window, 'popstate', onChange);
        on(window, 'pushstate', onChange);
        on(window, 'replacestate', onChange);
        return function () {
            off(window, 'popstate', onChange);
            off(window, 'pushstate', onChange);
            off(window, 'replacestate', onChange);
        };
    }, []);
    return value;
};
var useSearchParamServer = function () { return null; };
export default isBrowser ? useSearchParam : useSearchParamServer;
