import { __assign, __rest } from "tslib";
import { cloneElement, useEffect, useRef, useState } from 'react';
import { render } from 'react-universal-interface';
import useLatest from './useLatest';
import { noop, off, on } from './misc/util';
var useScratch = function (params) {
    if (params === void 0) { params = {}; }
    var disabled = params.disabled;
    var paramsRef = useLatest(params);
    var _a = useState({ isScratching: false }), state = _a[0], setState = _a[1];
    var refState = useRef(state);
    var refScratching = useRef(false);
    var refAnimationFrame = useRef(null);
    var _b = useState(null), el = _b[0], setEl = _b[1];
    useEffect(function () {
        if (disabled)
            return;
        if (!el)
            return;
        var onMoveEvent = function (docX, docY) {
            cancelAnimationFrame(refAnimationFrame.current);
            refAnimationFrame.current = requestAnimationFrame(function () {
                var _a = el.getBoundingClientRect(), left = _a.left, top = _a.top;
                var elX = left + window.scrollX;
                var elY = top + window.scrollY;
                var x = docX - elX;
                var y = docY - elY;
                setState(function (oldState) {
                    var newState = __assign(__assign({}, oldState), { dx: x - (oldState.x || 0), dy: y - (oldState.y || 0), end: Date.now(), isScratching: true });
                    refState.current = newState;
                    (paramsRef.current.onScratch || noop)(newState);
                    return newState;
                });
            });
        };
        var onMouseMove = function (event) {
            onMoveEvent(event.pageX, event.pageY);
        };
        var onTouchMove = function (event) {
            onMoveEvent(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
        };
        var onMouseUp;
        var onTouchEnd;
        var stopScratching = function () {
            if (!refScratching.current)
                return;
            refScratching.current = false;
            refState.current = __assign(__assign({}, refState.current), { isScratching: false });
            (paramsRef.current.onScratchEnd || noop)(refState.current);
            setState({ isScratching: false });
            off(window, 'mousemove', onMouseMove);
            off(window, 'touchmove', onTouchMove);
            off(window, 'mouseup', onMouseUp);
            off(window, 'touchend', onTouchEnd);
        };
        onMouseUp = stopScratching;
        onTouchEnd = stopScratching;
        var startScratching = function (docX, docY) {
            if (!refScratching.current)
                return;
            var _a = el.getBoundingClientRect(), left = _a.left, top = _a.top;
            var elX = left + window.scrollX;
            var elY = top + window.scrollY;
            var x = docX - elX;
            var y = docY - elY;
            var time = Date.now();
            var newState = {
                isScratching: true,
                start: time,
                end: time,
                docX: docX,
                docY: docY,
                x: x,
                y: y,
                dx: 0,
                dy: 0,
                elH: el.offsetHeight,
                elW: el.offsetWidth,
                elX: elX,
                elY: elY,
            };
            refState.current = newState;
            (paramsRef.current.onScratchStart || noop)(newState);
            setState(newState);
            on(window, 'mousemove', onMouseMove);
            on(window, 'touchmove', onTouchMove);
            on(window, 'mouseup', onMouseUp);
            on(window, 'touchend', onTouchEnd);
        };
        var onMouseDown = function (event) {
            refScratching.current = true;
            startScratching(event.pageX, event.pageY);
        };
        var onTouchStart = function (event) {
            refScratching.current = true;
            startScratching(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
        };
        on(el, 'mousedown', onMouseDown);
        on(el, 'touchstart', onTouchStart);
        return function () {
            off(el, 'mousedown', onMouseDown);
            off(el, 'touchstart', onTouchStart);
            off(window, 'mousemove', onMouseMove);
            off(window, 'touchmove', onTouchMove);
            off(window, 'mouseup', onMouseUp);
            off(window, 'touchend', onTouchEnd);
            if (refAnimationFrame.current)
                cancelAnimationFrame(refAnimationFrame.current);
            refAnimationFrame.current = null;
            refScratching.current = false;
            refState.current = { isScratching: false };
            setState(refState.current);
        };
    }, [el, disabled, paramsRef]);
    return [setEl, state];
};
export var ScratchSensor = function (props) {
    var children = props.children, params = __rest(props, ["children"]);
    var _a = useScratch(params), ref = _a[0], state = _a[1];
    var element = render(props, state);
    return cloneElement(element, __assign(__assign({}, element.props), { ref: function (el) {
            if (element.props.ref) {
                if (typeof element.props.ref === 'object')
                    element.props.ref.current = el;
                if (typeof element.props.ref === 'function')
                    element.props.ref(el);
            }
            ref(el);
        } }));
};
export default useScratch;
