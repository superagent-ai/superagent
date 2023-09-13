"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var util_1 = require("./misc/util");
var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;
var DRAF = function (callback) { return setTimeout(callback, 35); };
var useSize = function (element, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.width, width = _c === void 0 ? Infinity : _c, _d = _b.height, height = _d === void 0 ? Infinity : _d;
    if (!util_1.isBrowser) {
        return [
            typeof element === 'function' ? element({ width: width, height: height }) : element,
            { width: width, height: height },
        ];
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var _e = useState({ width: width, height: height }), state = _e[0], setState = _e[1];
    if (typeof element === 'function') {
        element = element(state);
    }
    var style = element.props.style || {};
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var ref = useRef(null);
    var window = null;
    var setSize = function () {
        var iframe = ref.current;
        var size = iframe
            ? {
                width: iframe.offsetWidth,
                height: iframe.offsetHeight,
            }
            : { width: width, height: height };
        setState(size);
    };
    var onWindow = function (windowToListenOn) {
        util_1.on(windowToListenOn, 'resize', setSize);
        DRAF(setSize);
    };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(function () {
        var iframe = ref.current;
        if (!iframe) {
            // iframe will be undefined if component is already unmounted
            return;
        }
        if (iframe.contentWindow) {
            window = iframe.contentWindow;
            onWindow(window);
        }
        else {
            var onLoad_1 = function () {
                util_1.on(iframe, 'load', onLoad_1);
                window = iframe.contentWindow;
                onWindow(window);
            };
            util_1.off(iframe, 'load', onLoad_1);
        }
        return function () {
            if (window && window.removeEventListener) {
                util_1.off(window, 'resize', setSize);
            }
        };
    }, []);
    style.position = 'relative';
    var sized = React.cloneElement.apply(React, tslib_1.__spreadArrays([element, { style: style }], tslib_1.__spreadArrays([
        React.createElement('iframe', {
            ref: ref,
            style: {
                background: 'transparent',
                border: 'none',
                height: '100%',
                left: 0,
                position: 'absolute',
                top: 0,
                width: '100%',
                zIndex: -1,
            },
        })
    ], React.Children.toArray(element.props.children))));
    return [sized, state];
};
exports.default = useSize;
