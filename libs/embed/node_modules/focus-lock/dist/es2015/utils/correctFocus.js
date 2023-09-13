import { isRadioElement } from './is';
var findSelectedRadio = function (node, nodes) {
    return nodes
        .filter(isRadioElement)
        .filter(function (el) { return el.name === node.name; })
        .filter(function (el) { return el.checked; })[0] || node;
};
export var correctNode = function (node, nodes) {
    if (isRadioElement(node) && node.name) {
        return findSelectedRadio(node, nodes);
    }
    return node;
};
/**
 * giving a set of radio inputs keeps only selected (tabbable) ones
 * @param nodes
 */
export var correctNodes = function (nodes) {
    // IE11 has no Set(array) constructor
    var resultSet = new Set();
    nodes.forEach(function (node) { return resultSet.add(correctNode(node, nodes)); });
    // using filter to support IE11
    return nodes.filter(function (node) { return resultSet.has(node); });
};
