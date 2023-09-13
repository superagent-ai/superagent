import { useReducer } from 'react';
var updateReducer = function (num) { return (num + 1) % 1000000; };
export default function useUpdate() {
    var _a = useReducer(updateReducer, 0), update = _a[1];
    return update;
}
