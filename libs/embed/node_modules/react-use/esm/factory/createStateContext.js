import { createContext, createElement, useContext, useState } from 'react';
var createStateContext = function (defaultInitialValue) {
    var context = createContext(undefined);
    var providerFactory = function (props, children) { return createElement(context.Provider, props, children); };
    var StateProvider = function (_a) {
        var children = _a.children, initialValue = _a.initialValue;
        var state = useState(initialValue !== undefined ? initialValue : defaultInitialValue);
        return providerFactory({ value: state }, children);
    };
    var useStateContext = function () {
        var state = useContext(context);
        if (state == null) {
            throw new Error("useStateContext must be used inside a StateProvider.");
        }
        return state;
    };
    return [useStateContext, StateProvider, context];
};
export default createStateContext;
