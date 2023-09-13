import { filterAutoFocusable } from './DOMutils';
import { pickFirstFocus } from './firstFocus';
import { getDataset } from './is';
const findAutoFocused = (autoFocusables) => (node) => {
    var _a;
    const autofocus = (_a = getDataset(node)) === null || _a === void 0 ? void 0 : _a.autofocus;
    return (
    // @ts-expect-error
    node.autofocus ||
        //
        (autofocus !== undefined && autofocus !== 'false') ||
        //
        autoFocusables.indexOf(node) >= 0);
};
export const pickAutofocus = (nodesIndexes, orderedNodes, groups) => {
    const nodes = nodesIndexes.map(({ node }) => node);
    const autoFocusable = filterAutoFocusable(nodes.filter(findAutoFocused(groups)));
    if (autoFocusable && autoFocusable.length) {
        return pickFirstFocus(autoFocusable);
    }
    return pickFirstFocus(filterAutoFocusable(orderedNodes));
};
