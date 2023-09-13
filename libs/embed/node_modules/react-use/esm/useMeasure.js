import { useMemo, useState } from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';
import { isBrowser, noop } from './misc/util';
var defaultState = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
};
function useMeasure() {
    var _a = useState(null), element = _a[0], ref = _a[1];
    var _b = useState(defaultState), rect = _b[0], setRect = _b[1];
    var observer = useMemo(function () {
        return new window.ResizeObserver(function (entries) {
            if (entries[0]) {
                var _a = entries[0].contentRect, x = _a.x, y = _a.y, width = _a.width, height = _a.height, top_1 = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right;
                setRect({ x: x, y: y, width: width, height: height, top: top_1, left: left, bottom: bottom, right: right });
            }
        });
    }, []);
    useIsomorphicLayoutEffect(function () {
        if (!element)
            return;
        observer.observe(element);
        return function () {
            observer.disconnect();
        };
    }, [element]);
    return [ref, rect];
}
export default isBrowser && typeof window.ResizeObserver !== 'undefined'
    ? useMeasure
    : (function () { return [noop, defaultState]; });
