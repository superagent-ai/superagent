import { useEffect } from 'react';
import useRafState from './useRafState';
import { isBrowser, off, on } from './misc/util';
var useWindowSize = function (initialWidth, initialHeight) {
    if (initialWidth === void 0) { initialWidth = Infinity; }
    if (initialHeight === void 0) { initialHeight = Infinity; }
    var _a = useRafState({
        width: isBrowser ? window.innerWidth : initialWidth,
        height: isBrowser ? window.innerHeight : initialHeight,
    }), state = _a[0], setState = _a[1];
    useEffect(function () {
        if (isBrowser) {
            var handler_1 = function () {
                setState({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };
            on(window, 'resize', handler_1);
            return function () {
                off(window, 'resize', handler_1);
            };
        }
    }, []);
    return state;
};
export default useWindowSize;
