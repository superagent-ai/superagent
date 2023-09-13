"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGlobalState = void 0;
var tslib_1 = require("tslib");
var react_1 = require("react");
var hookState_1 = require("../misc/hookState");
var useEffectOnce_1 = tslib_1.__importDefault(require("../useEffectOnce"));
var useIsomorphicLayoutEffect_1 = tslib_1.__importDefault(require("../useIsomorphicLayoutEffect"));
function createGlobalState(initialState) {
    var store = {
        state: initialState instanceof Function ? initialState() : initialState,
        setState: function (nextState) {
            store.state = hookState_1.resolveHookState(nextState, store.state);
            store.setters.forEach(function (setter) { return setter(store.state); });
        },
        setters: [],
    };
    return function () {
        var _a = react_1.useState(store.state), globalState = _a[0], stateSetter = _a[1];
        useEffectOnce_1.default(function () { return function () {
            store.setters = store.setters.filter(function (setter) { return setter !== stateSetter; });
        }; });
        useIsomorphicLayoutEffect_1.default(function () {
            if (!store.setters.includes(stateSetter)) {
                store.setters.push(stateSetter);
            }
        });
        return [globalState, store.setState];
    };
}
exports.createGlobalState = createGlobalState;
exports.default = createGlobalState;
