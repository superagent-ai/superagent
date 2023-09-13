import { getFocusMerge } from './focusMerge';
export const focusOn = (target, focusOptions) => {
    if ('focus' in target) {
        target.focus(focusOptions);
    }
    if ('contentWindow' in target && target.contentWindow) {
        target.contentWindow.focus();
    }
};
let guardCount = 0;
let lockDisabled = false;
/**
 * Sets focus at a given node. The last focused element will help to determine which element(first or last) should be focused.
 * HTML markers (see {@link import('./constants').FOCUS_AUTO} constants) can control autofocus
 * @param topNode
 * @param lastNode
 * @param options
 */
export const setFocus = (topNode, lastNode, options = {}) => {
    const focusable = getFocusMerge(topNode, lastNode);
    if (lockDisabled) {
        return;
    }
    if (focusable) {
        if (guardCount > 2) {
            // tslint:disable-next-line:no-console
            console.error('FocusLock: focus-fighting detected. Only one focus management system could be active. ' +
                'See https://github.com/theKashey/focus-lock/#focus-fighting');
            lockDisabled = true;
            setTimeout(() => {
                lockDisabled = false;
            }, 1);
            return;
        }
        guardCount++;
        focusOn(focusable.node, options.focusOptions);
        guardCount--;
    }
};
