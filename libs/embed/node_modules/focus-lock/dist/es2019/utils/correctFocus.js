import { isRadioElement } from './is';
const findSelectedRadio = (node, nodes) => nodes
    .filter(isRadioElement)
    .filter((el) => el.name === node.name)
    .filter((el) => el.checked)[0] || node;
export const correctNode = (node, nodes) => {
    if (isRadioElement(node) && node.name) {
        return findSelectedRadio(node, nodes);
    }
    return node;
};
/**
 * giving a set of radio inputs keeps only selected (tabbable) ones
 * @param nodes
 */
export const correctNodes = (nodes) => {
    // IE11 has no Set(array) constructor
    const resultSet = new Set();
    nodes.forEach((node) => resultSet.add(correctNode(node, nodes)));
    // using filter to support IE11
    return nodes.filter((node) => resultSet.has(node));
};
