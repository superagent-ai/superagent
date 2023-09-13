import { useCallback, useRef, useState } from 'react';
import useUnmount from './useUnmount';
var useRafState = function (initialState) {
    var frame = useRef(0);
    var _a = useState(initialState), state = _a[0], setState = _a[1];
    var setRafState = useCallback(function (value) {
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(function () {
            setState(value);
        });
    }, []);
    useUnmount(function () {
        cancelAnimationFrame(frame.current);
    });
    return [state, setRafState];
};
export default useRafState;
