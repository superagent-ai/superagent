"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var screenfull_1 = tslib_1.__importDefault(require("screenfull"));
var useIsomorphicLayoutEffect_1 = tslib_1.__importDefault(require("./useIsomorphicLayoutEffect"));
var util_1 = require("./misc/util");
var useFullscreen = function (ref, enabled, options) {
    if (options === void 0) { options = {}; }
    var video = options.video, _a = options.onClose, onClose = _a === void 0 ? util_1.noop : _a;
    var _b = react_1.useState(enabled), isFullscreen = _b[0], setIsFullscreen = _b[1];
    useIsomorphicLayoutEffect_1.default(function () {
        if (!enabled) {
            return;
        }
        if (!ref.current) {
            return;
        }
        var onWebkitEndFullscreen = function () {
            if (video === null || video === void 0 ? void 0 : video.current) {
                util_1.off(video.current, 'webkitendfullscreen', onWebkitEndFullscreen);
            }
            onClose();
        };
        var onChange = function () {
            if (screenfull_1.default.isEnabled) {
                var isScreenfullFullscreen = screenfull_1.default.isFullscreen;
                setIsFullscreen(isScreenfullFullscreen);
                if (!isScreenfullFullscreen) {
                    onClose();
                }
            }
        };
        if (screenfull_1.default.isEnabled) {
            try {
                screenfull_1.default.request(ref.current);
                setIsFullscreen(true);
            }
            catch (error) {
                onClose(error);
                setIsFullscreen(false);
            }
            screenfull_1.default.on('change', onChange);
        }
        else if (video && video.current && video.current.webkitEnterFullscreen) {
            video.current.webkitEnterFullscreen();
            util_1.on(video.current, 'webkitendfullscreen', onWebkitEndFullscreen);
            setIsFullscreen(true);
        }
        else {
            onClose();
            setIsFullscreen(false);
        }
        return function () {
            setIsFullscreen(false);
            if (screenfull_1.default.isEnabled) {
                try {
                    screenfull_1.default.off('change', onChange);
                    screenfull_1.default.exit();
                }
                catch (_a) { }
            }
            else if (video && video.current && video.current.webkitExitFullscreen) {
                util_1.off(video.current, 'webkitendfullscreen', onWebkitEndFullscreen);
                video.current.webkitExitFullscreen();
            }
        };
    }, [enabled, video, ref]);
    return isFullscreen;
};
exports.default = useFullscreen;
