import { __spreadArrays } from "tslib";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { noop, off, on } from './misc/util';
var createProcess = function (options) { return function (dataTransfer, event) {
    var uri = dataTransfer.getData('text/uri-list');
    if (uri) {
        (options.onUri || noop)(uri, event);
        return;
    }
    if (dataTransfer.files && dataTransfer.files.length) {
        (options.onFiles || noop)(Array.from(dataTransfer.files), event);
        return;
    }
    if (event.clipboardData) {
        var text = event.clipboardData.getData('text');
        (options.onText || noop)(text, event);
        return;
    }
}; };
var useDrop = function (options, args) {
    if (options === void 0) { options = {}; }
    if (args === void 0) { args = []; }
    var onFiles = options.onFiles, onText = options.onText, onUri = options.onUri;
    var _a = useState(false), over = _a[0], setOverRaw = _a[1];
    var setOver = useCallback(setOverRaw, []);
    var process = useMemo(function () { return createProcess(options); }, [onFiles, onText, onUri]);
    useEffect(function () {
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
        on(document, 'dragover', onDragOver);
        on(document, 'dragenter', onDragEnter);
        on(document, 'dragleave', onDragLeave);
        on(document, 'dragexit', onDragExit);
        on(document, 'drop', onDrop);
        if (onText) {
            on(document, 'paste', onPaste);
        }
        return function () {
            off(document, 'dragover', onDragOver);
            off(document, 'dragenter', onDragEnter);
            off(document, 'dragleave', onDragLeave);
            off(document, 'dragexit', onDragExit);
            off(document, 'drop', onDrop);
            off(document, 'paste', onPaste);
        };
    }, __spreadArrays([process], args));
    return { over: over };
};
export default useDrop;
