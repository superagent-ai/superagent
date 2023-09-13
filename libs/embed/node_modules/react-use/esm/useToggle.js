import { useReducer } from 'react';
var toggleReducer = function (state, nextValue) {
    return typeof nextValue === 'boolean' ? nextValue : !state;
};
var useToggle = function (initialValue) {
    return useReducer(toggleReducer, initialValue);
};
export default useToggle;
