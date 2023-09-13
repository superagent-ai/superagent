import { focusOn } from './setFocus';
import { getTabbableNodes, contains } from './utils/DOMutils';
var getRelativeFocusable = function (element, scope) {
    if (!element || !scope || !contains(scope, element)) {
        return {};
    }
    var focusables = getTabbableNodes([scope], new Map());
    var current = focusables.findIndex(function (_a) {
        var node = _a.node;
        return node === element;
    });
    if (current === -1) {
        return {};
    }
    return {
        prev: focusables[current - 1],
        next: focusables[current + 1],
        first: focusables[0],
        last: focusables[focusables.length - 1],
    };
};
var defaultOptions = function (options) {
    return Object.assign({
        scope: document.body,
        cycle: true,
    }, options);
};
/**
 * focuses next element in the tab-order
 * @param baseElement - common parent to scope active element search or tab cycle order
 * @param {FocusNextOptions} [options] - focus options
 */
export var focusNextElement = function (baseElement, options) {
    if (options === void 0) { options = {}; }
    var _a = defaultOptions(options), scope = _a.scope, cycle = _a.cycle;
    var _b = getRelativeFocusable(baseElement, scope), next = _b.next, first = _b.first;
    var newTarget = next || (cycle && first);
    if (newTarget) {
        focusOn(newTarget.node, options.focusOptions);
    }
};
/**
 * focuses prev element in the tab order
 * @param baseElement - common parent to scope active element search or tab cycle order
 * @param {FocusNextOptions} [options] - focus options
 */
export var focusPrevElement = function (baseElement, options) {
    if (options === void 0) { options = {}; }
    var _a = defaultOptions(options), scope = _a.scope, cycle = _a.cycle;
    var _b = getRelativeFocusable(baseElement, scope), prev = _b.prev, last = _b.last;
    var newTarget = prev || (cycle && last);
    if (newTarget) {
        focusOn(newTarget.node, options.focusOptions);
    }
};
