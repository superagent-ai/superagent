import { focusOn } from './setFocus';
import { getTabbableNodes, contains } from './utils/DOMutils';
const getRelativeFocusable = (element, scope) => {
    if (!element || !scope || !contains(scope, element)) {
        return {};
    }
    const focusables = getTabbableNodes([scope], new Map());
    const current = focusables.findIndex(({ node }) => node === element);
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
const defaultOptions = (options) => Object.assign({
    scope: document.body,
    cycle: true,
}, options);
/**
 * focuses next element in the tab-order
 * @param baseElement - common parent to scope active element search or tab cycle order
 * @param {FocusNextOptions} [options] - focus options
 */
export const focusNextElement = (baseElement, options = {}) => {
    const { scope, cycle } = defaultOptions(options);
    const { next, first } = getRelativeFocusable(baseElement, scope);
    const newTarget = next || (cycle && first);
    if (newTarget) {
        focusOn(newTarget.node, options.focusOptions);
    }
};
/**
 * focuses prev element in the tab order
 * @param baseElement - common parent to scope active element search or tab cycle order
 * @param {FocusNextOptions} [options] - focus options
 */
export const focusPrevElement = (baseElement, options = {}) => {
    const { scope, cycle } = defaultOptions(options);
    const { prev, last } = getRelativeFocusable(baseElement, scope);
    const newTarget = prev || (cycle && last);
    if (newTarget) {
        focusOn(newTarget.node, options.focusOptions);
    }
};
