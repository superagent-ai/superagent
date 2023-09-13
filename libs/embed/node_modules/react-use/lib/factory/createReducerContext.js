"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var createReducerContext = function (reducer, defaultInitialState) {
    var context = react_1.createContext(undefined);
    var providerFactory = function (props, children) { return react_1.createElement(context.Provider, props, children); };
    var ReducerProvider = function (_a) {
        var children = _a.children, initialState = _a.initialState;
        var state = react_1.useReducer(reducer, initialState !== undefined ? initialState : defaultInitialState);
        return providerFactory({ value: state }, children);
    };
    var useReducerContext = function () {
        var state = react_1.useContext(context);
        if (state == null) {
            throw new Error("useReducerContext must be used inside a ReducerProvider.");
        }
        return state;
    };
    return [useReducerContext, ReducerProvider, context];
};
exports.default = createReducerContext;
