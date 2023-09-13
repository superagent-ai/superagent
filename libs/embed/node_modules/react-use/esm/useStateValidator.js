import { useCallback, useEffect, useRef, useState } from 'react';
export default function useStateValidator(state, validator, initialState) {
    if (initialState === void 0) { initialState = [undefined]; }
    var validatorInner = useRef(validator);
    var stateInner = useRef(state);
    validatorInner.current = validator;
    stateInner.current = state;
    var _a = useState(initialState), validity = _a[0], setValidity = _a[1];
    var validate = useCallback(function () {
        if (validatorInner.current.length >= 2) {
            validatorInner.current(stateInner.current, setValidity);
        }
        else {
            setValidity(validatorInner.current(stateInner.current));
        }
    }, [setValidity]);
    useEffect(function () {
        validate();
    }, [state]);
    return [validity, validate];
}
