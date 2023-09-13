"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFocus = exports.focusOn = void 0;
var focusMerge_1 = require("./focusMerge");
var focusOn = function (target, focusOptions) {
    if ('focus' in target) {
        target.focus(focusOptions);
    }
    if ('contentWindow' in target && target.contentWindow) {
        target.contentWindow.focus();
    }
};
exports.focusOn = focusOn;
var guardCount = 0;
var lockDisabled = false;
/**
 * Sets focus at a given node. The last focused element will help to determine which element(first or last) should be focused.
 * HTML markers (see {@link import('./constants').FOCUS_AUTO} constants) can control autofocus
 * @param topNode
 * @param lastNode
 * @param options
 */
var setFocus = function (topNode, lastNode, options) {
    if (options === void 0) { options = {}; }
    var focusable = (0, focusMerge_1.getFocusMerge)(topNode, lastNode);
    if (lockDisabled) {
        return;
    }
    if (focusable) {
        if (guardCount > 2) {
            // tslint:disable-next-line:no-console
            console.error('FocusLock: focus-fighting detected. Only one focus management system could be active. ' +
                'See https://github.com/theKashey/focus-lock/#focus-fighting');
            lockDisabled = true;
            setTimeout(function () {
                lockDisabled = false;
            }, 1);
            return;
        }
        guardCount++;
        (0, exports.focusOn)(focusable.node, options.focusOptions);
        guardCount--;
    }
};
exports.setFocus = setFocus;
