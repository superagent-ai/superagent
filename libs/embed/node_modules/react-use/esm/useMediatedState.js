import { useCallback, useRef, useState } from 'react';
export function useMediatedState(mediator, initialState) {
    var mediatorFn = useRef(mediator);
    var _a = useState(initialState), state = _a[0], setMediatedState = _a[1];
    var setState = useCallback(function (newState) {
        if (mediatorFn.current.length === 2) {
            mediatorFn.current(newState, setMediatedState);
        }
        else {
            setMediatedState(mediatorFn.current(newState));
        }
    }, [state]);
    return [state, setState];
}
