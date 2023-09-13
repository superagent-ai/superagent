import { useEffect, useState } from 'react';
import useMount from './useMount';
var useKeyboardJs = function (combination) {
    var _a = useState([false, null]), state = _a[0], set = _a[1];
    var _b = useState(null), keyboardJs = _b[0], setKeyboardJs = _b[1];
    useMount(function () {
        import('keyboardjs').then(function (k) { return setKeyboardJs(k.default || k); });
    });
    useEffect(function () {
        if (!keyboardJs) {
            return;
        }
        var down = function (event) { return set([true, event]); };
        var up = function (event) { return set([false, event]); };
        keyboardJs.bind(combination, down, up, true);
        return function () {
            keyboardJs.unbind(combination, down, up);
        };
    }, [combination, keyboardJs]);
    return state;
};
export default useKeyboardJs;
