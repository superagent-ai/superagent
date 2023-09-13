import { useEffect } from 'react';
import { off, on } from './misc/util';
var usePageLeave = function (onPageLeave, args) {
    if (args === void 0) { args = []; }
    useEffect(function () {
        if (!onPageLeave) {
            return;
        }
        var handler = function (event) {
            event = event ? event : window.event;
            var from = event.relatedTarget || event.toElement;
            if (!from || from.nodeName === 'HTML') {
                onPageLeave();
            }
        };
        on(document, 'mouseout', handler);
        return function () {
            off(document, 'mouseout', handler);
        };
    }, args);
};
export default usePageLeave;
