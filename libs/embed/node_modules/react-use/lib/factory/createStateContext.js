"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var createStateContext = function (defaultInitialValue) {
    var context = react_1.createContext(undefined);
    var providerFactory = function (props, children) { return react_1.createElement(context.Provider, props, children); };
    var StateProvider = function (_a) {
        var children = _a.children, initialValue = _a.initialValue;
        var state = react_1.useState(initialValue !== undefined ? initialValue : defaultInitialValue);
        return providerFactory({ value: state }, children);
    };
    var useStateContext = function () {
        var state = react_1.useContext(context);
        if (state == null) {
            throw new Error("useStateContext must be used inside a StateProvider.");
        }
        return state;
    };
    return [useStateContext, StateProvider, context];
};
exports.default = createStateContext;
