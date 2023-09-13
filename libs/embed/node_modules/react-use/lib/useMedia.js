"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var util_1 = require("./misc/util");
var getInitialState = function (query, defaultState) {
    // Prevent a React hydration mismatch when a default value is provided by not defaulting to window.matchMedia(query).matches.
    if (defaultState !== undefined) {
        return defaultState;
    }
    if (util_1.isBrowser) {
        return window.matchMedia(query).matches;
    }
    // A default value has not been provided, and you are rendering on the server, warn of a possible hydration mismatch when defaulting to false.
    if (process.env.NODE_ENV !== 'production') {
        console.warn('`useMedia` When server side rendering, defaultState should be defined to prevent a hydration mismatches.');
    }
    return false;
};
var useMedia = function (query, defaultState) {
    var _a = react_1.useState(getInitialState(query, defaultState)), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        var mounted = true;
        var mql = window.matchMedia(query);
        var onChange = function () {
            if (!mounted) {
                return;
            }
            setState(!!mql.matches);
        };
        mql.addListener(onChange);
        setState(mql.matches);
        return function () {
            mounted = false;
            mql.removeListener(onChange);
        };
    }, [query]);
    return state;
};
exports.default = useMedia;
