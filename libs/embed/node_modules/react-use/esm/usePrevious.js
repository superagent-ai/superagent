import { useEffect, useRef } from 'react';
export default function usePrevious(state) {
    var ref = useRef();
    useEffect(function () {
        ref.current = state;
    });
    return ref.current;
}
