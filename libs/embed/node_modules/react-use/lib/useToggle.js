"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var toggleReducer = function (state, nextValue) {
    return typeof nextValue === 'boolean' ? nextValue : !state;
};
var useToggle = function (initialValue) {
    return react_1.useReducer(toggleReducer, initialValue);
};
exports.default = useToggle;
