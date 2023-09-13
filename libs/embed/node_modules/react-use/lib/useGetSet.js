"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useUpdate_1 = tslib_1.__importDefault(require("./useUpdate"));
var hookState_1 = require("./misc/hookState");
function useGetSet(initialState) {
    var state = react_1.useRef(hookState_1.resolveHookState(initialState));
    var update = useUpdate_1.default();
    return react_1.useMemo(function () { return [
        function () { return state.current; },
        function (newState) {
            state.current = hookState_1.resolveHookState(newState, state.current);
            update();
        },
    ]; }, []);
}
exports.default = useGetSet;
