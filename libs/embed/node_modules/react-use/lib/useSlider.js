"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var util_1 = require("./misc/util");
var useMountedState_1 = tslib_1.__importDefault(require("./useMountedState"));
var useSetState_1 = tslib_1.__importDefault(require("./useSetState"));
var useSlider = function (ref, options) {
    if (options === void 0) { options = {}; }
    var isMounted = useMountedState_1.default();
    var isSliding = react_1.useRef(false);
    var valueRef = react_1.useRef(0);
    var frame = react_1.useRef(0);
    var _a = useSetState_1.default({
        isSliding: false,
        value: 0,
    }), state = _a[0], setState = _a[1];
    valueRef.current = state.value;
    react_1.useEffect(function () {
        if (util_1.isBrowser) {
            var styles = options.styles === undefined ? true : options.styles;
            var reverse_1 = options.reverse === undefined ? false : options.reverse;
            if (ref.current && styles) {
                ref.current.style.userSelect = 'none';
            }
            var startScrubbing_1 = function () {
                if (!isSliding.current && isMounted()) {
                    (options.onScrubStart || util_1.noop)();
                    isSliding.current = true;
                    setState({ isSliding: true });
                    bindEvents_1();
                }
            };
            var stopScrubbing_1 = function () {
                if (isSliding.current && isMounted()) {
                    (options.onScrubStop || util_1.noop)(valueRef.current);
                    isSliding.current = false;
                    setState({ isSliding: false });
                    unbindEvents_1();
                }
            };
            var onMouseDown_1 = function (event) {
                startScrubbing_1();
                onMouseMove_1(event);
            };
            var onMouseMove_1 = options.vertical
                ? function (event) { return onScrub_1(event.clientY); }
                : function (event) { return onScrub_1(event.clientX); };
            var onTouchStart_1 = function (event) {
                startScrubbing_1();
                onTouchMove_1(event);
            };
            var onTouchMove_1 = options.vertical
                ? function (event) { return onScrub_1(event.changedTouches[0].clientY); }
                : function (event) { return onScrub_1(event.changedTouches[0].clientX); };
            var bindEvents_1 = function () {
                util_1.on(document, 'mousemove', onMouseMove_1);
                util_1.on(document, 'mouseup', stopScrubbing_1);
                util_1.on(document, 'touchmove', onTouchMove_1);
                util_1.on(document, 'touchend', stopScrubbing_1);
            };
            var unbindEvents_1 = function () {
                util_1.off(document, 'mousemove', onMouseMove_1);
                util_1.off(document, 'mouseup', stopScrubbing_1);
                util_1.off(document, 'touchmove', onTouchMove_1);
                util_1.off(document, 'touchend', stopScrubbing_1);
            };
            var onScrub_1 = function (clientXY) {
                cancelAnimationFrame(frame.current);
                frame.current = requestAnimationFrame(function () {
                    if (isMounted() && ref.current) {
                        var rect = ref.current.getBoundingClientRect();
                        var pos = options.vertical ? rect.top : rect.left;
                        var length_1 = options.vertical ? rect.height : rect.width;
                        // Prevent returning 0 when element is hidden by CSS
                        if (!length_1) {
                            return;
                        }
                        var value = (clientXY - pos) / length_1;
                        if (value > 1) {
                            value = 1;
                        }
                        else if (value < 0) {
                            value = 0;
                        }
                        if (reverse_1) {
                            value = 1 - value;
                        }
                        setState({
                            value: value,
                        });
                        (options.onScrub || util_1.noop)(value);
                    }
                });
            };
            util_1.on(ref.current, 'mousedown', onMouseDown_1);
            util_1.on(ref.current, 'touchstart', onTouchStart_1);
            return function () {
                util_1.off(ref.current, 'mousedown', onMouseDown_1);
                util_1.off(ref.current, 'touchstart', onTouchStart_1);
            };
        }
        else {
            return undefined;
        }
    }, [ref, options.vertical]);
    return state;
};
exports.default = useSlider;
