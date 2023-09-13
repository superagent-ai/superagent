import { useEffect, useState } from 'react';
import { off, on } from './misc/util';
export default (function () {
    var _a = useState(0), mouseWheelScrolled = _a[0], setMouseWheelScrolled = _a[1];
    useEffect(function () {
        var updateScroll = function (e) {
            setMouseWheelScrolled(e.deltaY + mouseWheelScrolled);
        };
        on(window, 'wheel', updateScroll, false);
        return function () { return off(window, 'wheel', updateScroll); };
    });
    return mouseWheelScrolled;
});
