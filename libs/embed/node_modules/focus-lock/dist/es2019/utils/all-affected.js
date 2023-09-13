import { FOCUS_DISABLED, FOCUS_GROUP } from '../constants';
import { asArray, toArray } from './array';
/**
 * in case of multiple nodes nested inside each other
 * keeps only top ones
 * this is O(nlogn)
 * @param nodes
 * @returns {*}
 */
const filterNested = (nodes) => {
    const contained = new Set();
    const l = nodes.length;
    for (let i = 0; i < l; i += 1) {
        for (let j = i + 1; j < l; j += 1) {
            const position = nodes[i].compareDocumentPosition(nodes[j]);
            /* eslint-disable no-bitwise */
            if ((position & Node.DOCUMENT_POSITION_CONTAINED_BY) > 0) {
                contained.add(j);
            }
            if ((position & Node.DOCUMENT_POSITION_CONTAINS) > 0) {
                contained.add(i);
            }
            /* eslint-enable */
        }
    }
    return nodes.filter((_, index) => !contained.has(index));
};
/**
 * finds top most parent for a node
 * @param node
 * @returns {*}
 */
const getTopParent = (node) => node.parentNode ? getTopParent(node.parentNode) : node;
/**
 * returns all "focus containers" inside a given node
 * @param node
 * @returns {T}
 */
export const getAllAffectedNodes = (node) => {
    const nodes = asArray(node);
    return nodes.filter(Boolean).reduce((acc, currentNode) => {
        const group = currentNode.getAttribute(FOCUS_GROUP);
        acc.push(...(group
            ? filterNested(toArray(getTopParent(currentNode).querySelectorAll(`[${FOCUS_GROUP}="${group}"]:not([${FOCUS_DISABLED}="disabled"])`)))
            : [currentNode]));
        return acc;
    }, []);
};
