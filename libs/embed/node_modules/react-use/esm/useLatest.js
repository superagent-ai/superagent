import { useRef } from 'react';
var useLatest = function (value) {
    var ref = useRef(value);
    ref.current = value;
    return ref;
};
export default useLatest;
