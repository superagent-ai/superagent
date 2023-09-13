"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScratchSensor = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var react_universal_interface_1 = require("react-universal-interface");
var useLatest_1 = tslib_1.__importDefault(require("./useLatest"));
var util_1 = require("./misc/util");
var useScratch = function (params) {
    if (params === void 0) { params = {}; }
    var disabled = params.disabled;
    var paramsRef = useLatest_1.default(params);
    var _a = react_1.useState({ isScratching: false }), state = _a[0], setState = _a[1];
    var refState = react_1.useRef(state);
    var refScratching = react_1.useRef(false);
    var refAnimationFrame = react_1.useRef(null);
    var _b = react_1.useState(null), el = _b[0], setEl = _b[1];
    react_1.useEffect(function () {
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
                    var newState = tslib_1.__assign(tslib_1.__assign({}, oldState), { dx: x - (oldState.x || 0), dy: y - (oldState.y || 0), end: Date.now(), isScratching: true });
                    refState.current = newState;
                    (paramsRef.current.onScratch || util_1.noop)(newState);
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
            refState.current = tslib_1.__assign(tslib_1.__assign({}, refState.current), { isScratching: false });
            (paramsRef.current.onScratchEnd || util_1.noop)(refState.current);
            setState({ isScratching: false });
            util_1.off(window, 'mousemove', onMouseMove);
            util_1.off(window, 'touchmove', onTouchMove);
            util_1.off(window, 'mouseup', onMouseUp);
            util_1.off(window, 'touchend', onTouchEnd);
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
            (paramsRef.current.onScratchStart || util_1.noop)(newState);
            setState(newState);
            util_1.on(window, 'mousemove', onMouseMove);
            util_1.on(window, 'touchmove', onTouchMove);
            util_1.on(window, 'mouseup', onMouseUp);
            util_1.on(window, 'touchend', onTouchEnd);
        };
        var onMouseDown = function (event) {
            refScratching.current = true;
            startScratching(event.pageX, event.pageY);
        };
        var onTouchStart = function (event) {
            refScratching.current = true;
            startScratching(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
        };
        util_1.on(el, 'mousedown', onMouseDown);
        util_1.on(el, 'touchstart', onTouchStart);
        return function () {
            util_1.off(el, 'mousedown', onMouseDown);
            util_1.off(el, 'touchstart', onTouchStart);
            util_1.off(window, 'mousemove', onMouseMove);
            util_1.off(window, 'touchmove', onTouchMove);
            util_1.off(window, 'mouseup', onMouseUp);
            util_1.off(window, 'touchend', onTouchEnd);
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
var ScratchSensor = function (props) {
    var children = props.children, params = tslib_1.__rest(props, ["children"]);
    var _a = useScratch(params), ref = _a[0], state = _a[1];
    var element = react_universal_interface_1.render(props, state);
    return react_1.cloneElement(element, tslib_1.__assign(tslib_1.__assign({}, element.props), { ref: function (el) {
            if (element.props.ref) {
                if (typeof element.props.ref === 'object')
                    element.props.ref.current = el;
                if (typeof element.props.ref === 'function')
                    element.props.ref(el);
            }
            ref(el);
        } }));
};
exports.ScratchSensor = ScratchSensor;
exports.default = useScratch;
