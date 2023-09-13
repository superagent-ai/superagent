import { useMemo, useRef } from 'react';
import useUpdate from './useUpdate';
import { resolveHookState } from './misc/hookState';
export default function useGetSet(initialState) {
    var state = useRef(resolveHookState(initialState));
    var update = useUpdate();
    return useMemo(function () { return [
        function () { return state.current; },
        function (newState) {
            state.current = resolveHookState(newState, state.current);
            update();
        },
    ]; }, []);
}
