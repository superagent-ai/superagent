import { useCallback, useState } from 'react';
import useLifecycles from './useLifecycles';
import { off, on } from './misc/util';
/**
 * read and write url hash, response to url hash change
 */
export var useHash = function () {
    var _a = useState(function () { return window.location.hash; }), hash = _a[0], setHash = _a[1];
    var onHashChange = useCallback(function () {
        setHash(window.location.hash);
    }, []);
    useLifecycles(function () {
        on(window, 'hashchange', onHashChange);
    }, function () {
        off(window, 'hashchange', onHashChange);
    });
    var _setHash = useCallback(function (newHash) {
        if (newHash !== hash) {
            window.location.hash = newHash;
        }
    }, [hash]);
    return [hash, _setHash];
};
