import { toArray } from './array';
export const tabSort = (a, b) => {
    const tabDiff = a.tabIndex - b.tabIndex;
    const indexDiff = a.index - b.index;
    if (tabDiff) {
        if (!a.tabIndex) {
            return 1;
        }
        if (!b.tabIndex) {
            return -1;
        }
    }
    return tabDiff || indexDiff;
};
export const orderByTabIndex = (nodes, filterNegative, keepGuards) => toArray(nodes)
    .map((node, index) => ({
    node,
    index,
    tabIndex: keepGuards && node.tabIndex === -1 ? ((node.dataset || {}).focusGuard ? 0 : -1) : node.tabIndex,
}))
    .filter((data) => !filterNegative || data.tabIndex >= 0)
    .sort(tabSort);
