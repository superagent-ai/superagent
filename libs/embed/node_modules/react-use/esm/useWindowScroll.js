import { useEffect } from 'react';
import { isBrowser, off, on } from './misc/util';
import useRafState from './useRafState';
var useWindowScroll = function () {
    var _a = useRafState(function () { return ({
        x: isBrowser ? window.pageXOffset : 0,
        y: isBrowser ? window.pageYOffset : 0,
    }); }), state = _a[0], setState = _a[1];
    useEffect(function () {
        var handler = function () {
            setState(function (state) {
                var pageXOffset = window.pageXOffset, pageYOffset = window.pageYOffset;
                //Check state for change, return same state if no change happened to prevent rerender
                //(see useState/setState documentation). useState/setState is used internally in useRafState/setState.
                return state.x !== pageXOffset || state.y !== pageYOffset
                    ? {
                        x: pageXOffset,
                        y: pageYOffset,
                    }
                    : state;
            });
        };
        //We have to update window scroll at mount, before subscription.
        //Window scroll may be changed between render and effect handler.
        handler();
        on(window, 'scroll', handler, {
            capture: false,
            passive: true,
        });
        return function () {
            off(window, 'scroll', handler);
        };
    }, []);
    return state;
};
export default useWindowScroll;
