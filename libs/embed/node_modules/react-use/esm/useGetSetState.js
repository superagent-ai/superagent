import { __assign } from "tslib";
import { useCallback, useRef } from 'react';
import useUpdate from './useUpdate';
var useGetSetState = function (initialState) {
    if (initialState === void 0) { initialState = {}; }
    if (process.env.NODE_ENV !== 'production') {
        if (typeof initialState !== 'object') {
            console.error('useGetSetState initial state must be an object.');
        }
    }
    var update = useUpdate();
    var state = useRef(__assign({}, initialState));
    var get = useCallback(function () { return state.current; }, []);
    var set = useCallback(function (patch) {
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
export default useGetSetState;
