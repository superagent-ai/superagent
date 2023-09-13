import { FOCUS_AUTO } from '../constants';
import { toArray } from './array';
import { tabbables } from './tabbables';
const queryTabbables = tabbables.join(',');
const queryGuardTabbables = `${queryTabbables}, [data-focus-guard]`;
const getFocusablesWithShadowDom = (parent, withGuards) => toArray((parent.shadowRoot || parent).children).reduce((acc, child) => acc.concat(child.matches(withGuards ? queryGuardTabbables : queryTabbables) ? [child] : [], getFocusablesWithShadowDom(child)), []);
const getFocusablesWithIFrame = (parent, withGuards) => {
    var _a;
    // contentDocument of iframe will be null if current origin cannot access it
    if (parent instanceof HTMLIFrameElement && ((_a = parent.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) {
        return getFocusables([parent.contentDocument.body], withGuards);
    }
    return [parent];
};
export const getFocusables = (parents, withGuards) => {
    return parents.reduce((acc, parent) => {
        const focusableWithShadowDom = getFocusablesWithShadowDom(parent, withGuards);
        const focusableWithIframes = [].concat(...focusableWithShadowDom.map((node) => getFocusablesWithIFrame(node, withGuards)));
        return acc.concat(
        // add all tabbables inside and within shadow DOMs in DOM order
        focusableWithIframes, 
        // add if node is tabbable itself
        parent.parentNode
            ? toArray(parent.parentNode.querySelectorAll(queryTabbables)).filter((node) => node === parent)
            : []);
    }, []);
};
/**
 * return a list of focusable nodes within an area marked as "auto-focusable"
 * @param parent
 */
export const getParentAutofocusables = (parent) => {
    const parentFocus = parent.querySelectorAll(`[${FOCUS_AUTO}]`);
    return toArray(parentFocus)
        .map((node) => getFocusables([node]))
        .reduce((acc, nodes) => acc.concat(nodes), []);
};
