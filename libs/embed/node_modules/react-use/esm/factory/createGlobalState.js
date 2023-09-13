import { useState } from 'react';
import { resolveHookState } from '../misc/hookState';
import useEffectOnce from '../useEffectOnce';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';
export function createGlobalState(initialState) {
    var store = {
        state: initialState instanceof Function ? initialState() : initialState,
        setState: function (nextState) {
            store.state = resolveHookState(nextState, store.state);
            store.setters.forEach(function (setter) { return setter(store.state); });
        },
        setters: [],
    };
    return function () {
        var _a = useState(store.state), globalState = _a[0], stateSetter = _a[1];
        useEffectOnce(function () { return function () {
            store.setters = store.setters.filter(function (setter) { return setter !== stateSetter; });
        }; });
        useIsomorphicLayoutEffect(function () {
            if (!store.setters.includes(stateSetter)) {
                store.setters.push(stateSetter);
            }
        });
        return [globalState, store.setState];
    };
}
export default createGlobalState;
