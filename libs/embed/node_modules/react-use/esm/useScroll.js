import { useEffect } from 'react';
import useRafState from './useRafState';
import { off, on } from './misc/util';
var useScroll = function (ref) {
    if (process.env.NODE_ENV === 'development') {
        if (typeof ref !== 'object' || typeof ref.current === 'undefined') {
            console.error('`useScroll` expects a single ref argument.');
        }
    }
    var _a = useRafState({
        x: 0,
        y: 0,
    }), state = _a[0], setState = _a[1];
    useEffect(function () {
        var handler = function () {
            if (ref.current) {
                setState({
                    x: ref.current.scrollLeft,
                    y: ref.current.scrollTop,
                });
            }
        };
        if (ref.current) {
            on(ref.current, 'scroll', handler, {
                capture: false,
                passive: true,
            });
        }
        return function () {
            if (ref.current) {
                off(ref.current, 'scroll', handler);
            }
        };
    }, [ref]);
    return state;
};
export default useScroll;
