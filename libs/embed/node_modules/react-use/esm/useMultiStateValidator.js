import { useCallback, useEffect, useRef, useState } from 'react';
export function useMultiStateValidator(states, validator, initialValidity) {
    if (initialValidity === void 0) { initialValidity = [undefined]; }
    if (typeof states !== 'object') {
        throw new Error('states expected to be an object or array, got ' + typeof states);
    }
    var validatorInner = useRef(validator);
    var statesInner = useRef(states);
    validatorInner.current = validator;
    statesInner.current = states;
    var _a = useState(initialValidity), validity = _a[0], setValidity = _a[1];
    var validate = useCallback(function () {
        if (validatorInner.current.length >= 2) {
            validatorInner.current(statesInner.current, setValidity);
        }
        else {
            setValidity(validatorInner.current(statesInner.current));
        }
    }, [setValidity]);
    useEffect(function () {
        validate();
    }, Object.values(states));
    return [validity, validate];
}
