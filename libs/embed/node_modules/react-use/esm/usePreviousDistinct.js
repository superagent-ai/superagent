import { useRef } from 'react';
import { useFirstMountState } from './useFirstMountState';
var strictEquals = function (prev, next) { return prev === next; };
export default function usePreviousDistinct(value, compare) {
    if (compare === void 0) { compare = strictEquals; }
    var prevRef = useRef();
    var curRef = useRef(value);
    var isFirstMount = useFirstMountState();
    if (!isFirstMount && !compare(curRef.current, value)) {
        prevRef.current = curRef.current;
        curRef.current = value;
    }
    return prevRef.current;
}
