"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var util_1 = require("./misc/util");
var createProcess = function (options) { return function (dataTransfer, event) {
    var uri = dataTransfer.getData('text/uri-list');
    if (uri) {
        (options.onUri || util_1.noop)(uri, event);
        return;
    }
    if (dataTransfer.files && dataTransfer.files.length) {
        (options.onFiles || util_1.noop)(Array.from(dataTransfer.files), event);
        return;
    }
    if (event.clipboardData) {
        var text = event.clipboardData.getData('text');
        (options.onText || util_1.noop)(text, event);
        return;
    }
}; };
var useDrop = function (options, args) {
    if (options === void 0) { options = {}; }
    if (args === void 0) { args = []; }
    var onFiles = options.onFiles, onText = options.onText, onUri = options.onUri;
    var _a = react_1.useState(false), over = _a[0], setOverRaw = _a[1];
    var setOver = react_1.useCallback(setOverRaw, []);
    var process = react_1.useMemo(function () { return createProcess(options); }, [onFiles, onText, onUri]);
    react_1.useEffect(function () {
        var onDragOver = function (event) {
            event.preventDefault();
            setOver(true);
        };
        var onDragEnter = function (event) {
            event.preventDefault();
            setOver(true);
        };
        var onDragLeave = function () {
            setOver(false);
        };
        var onDragExit = function () {
            setOver(false);
        };
        var onDrop = function (event) {
            event.preventDefault();
            setOver(false);
            process(event.dataTransfer, event);
        };
        var onPaste = function (event) {
            process(event.clipboardData, event);
        };
        util_1.on(document, 'dragover', onDragOver);
        util_1.on(document, 'dragenter', onDragEnter);
        util_1.on(document, 'dragleave', onDragLeave);
        util_1.on(document, 'dragexit', onDragExit);
        util_1.on(document, 'drop', onDrop);
        if (onText) {
            util_1.on(document, 'paste', onPaste);
        }
        return function () {
            util_1.off(document, 'dragover', onDragOver);
            util_1.off(document, 'dragenter', onDragEnter);
            util_1.off(document, 'dragleave', onDragLeave);
            util_1.off(document, 'dragexit', onDragExit);
            util_1.off(document, 'drop', onDrop);
            util_1.off(document, 'paste', onPaste);
        };
    }, tslib_1.__spreadArrays([process], args));
    return { over: over };
};
exports.default = useDrop;
