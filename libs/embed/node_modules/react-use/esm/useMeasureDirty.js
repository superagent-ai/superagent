import { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
var useMeasureDirty = function (ref) {
    var frame = useRef(0);
    var _a = useState({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    }), rect = _a[0], set = _a[1];
    var observer = useState(function () {
        return new ResizeObserver(function (entries) {
            var entry = entries[0];
            if (entry) {
                cancelAnimationFrame(frame.current);
                frame.current = requestAnimationFrame(function () {
                    if (ref.current) {
                        set(entry.contentRect);
                    }
                });
            }
        });
    })[0];
    useEffect(function () {
        observer.disconnect();
        if (ref.current) {
            observer.observe(ref.current);
        }
    }, [ref]);
    return rect;
};
export default useMeasureDirty;
