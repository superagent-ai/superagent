"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useUpdate_1 = tslib_1.__importDefault(require("./useUpdate"));
var useGetSetState = function (initialState) {
    if (initialState === void 0) { initialState = {}; }
    if (process.env.NODE_ENV !== 'production') {
        if (typeof initialState !== 'object') {
            console.error('useGetSetState initial state must be an object.');
        }
    }
    var update = useUpdate_1.default();
    var state = react_1.useRef(tslib_1.__assign({}, initialState));
    var get = react_1.useCallback(function () { return state.current; }, []);
    var set = react_1.useCallback(function (patch) {
        if (!patch) {
            return;
        }
        if (process.env.NODE_ENV !== 'production') {
            if (typeof patch !== 'object') {
                console.error('useGetSetState setter patch must be an object.');
            }
        }
        Object.assign(state.current, patch);
        update();
    }, []);
    return [get, set];
};
exports.default = useGetSetState;
