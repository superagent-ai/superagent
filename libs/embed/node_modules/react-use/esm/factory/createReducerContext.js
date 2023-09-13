import { createContext, createElement, useContext, useReducer } from 'react';
var createReducerContext = function (reducer, defaultInitialState) {
    var context = createContext(undefined);
    var providerFactory = function (props, children) { return createElement(context.Provider, props, children); };
    var ReducerProvider = function (_a) {
        var children = _a.children, initialState = _a.initialState;
        var state = useReducer(reducer, initialState !== undefined ? initialState : defaultInitialState);
        return providerFactory({ value: state }, children);
    };
    var useReducerContext = function () {
        var state = useContext(context);
        if (state == null) {
            throw new Error("useReducerContext must be used inside a ReducerProvider.");
        }
        return state;
    };
    return [useReducerContext, ReducerProvider, context];
};
export default createReducerContext;
