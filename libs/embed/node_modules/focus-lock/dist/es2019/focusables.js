import { getTabbableNodes } from './utils/DOMutils';
import { getAllAffectedNodes } from './utils/all-affected';
import { isGuard, isNotAGuard } from './utils/is';
import { getTopCommonParent } from './utils/parenting';
/**
 * return list of focusable elements inside a given top node
 * @deprecated use {@link getFocusableIn}. Yep, there is typo in the function name
 */
export const getFocusabledIn = (topNode) => {
    const entries = getAllAffectedNodes(topNode).filter(isNotAGuard);
    const commonParent = getTopCommonParent(topNode, topNode, entries);
    const visibilityCache = new Map();
    const outerNodes = getTabbableNodes([commonParent], visibilityCache, true);
    const innerElements = getTabbableNodes(entries, visibilityCache)
        .filter(({ node }) => isNotAGuard(node))
        .map(({ node }) => node);
    return outerNodes.map(({ node, index }) => ({
        node,
        index,
        lockItem: innerElements.indexOf(node) >= 0,
        guard: isGuard(node),
    }));
};
/**
 * return list of focusable elements inside a given top node
 */
export const getFocusableIn = getFocusabledIn;
