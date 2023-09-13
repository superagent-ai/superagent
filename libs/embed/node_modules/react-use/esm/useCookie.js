import { useCallback, useState } from 'react';
import Cookies from 'js-cookie';
var useCookie = function (cookieName) {
    var _a = useState(function () { return Cookies.get(cookieName) || null; }), value = _a[0], setValue = _a[1];
    var updateCookie = useCallback(function (newValue, options) {
        Cookies.set(cookieName, newValue, options);
        setValue(newValue);
    }, [cookieName]);
    var deleteCookie = useCallback(function () {
        Cookies.remove(cookieName);
        setValue(null);
    }, [cookieName]);
    return [value, updateCookie, deleteCookie];
};
export default useCookie;
