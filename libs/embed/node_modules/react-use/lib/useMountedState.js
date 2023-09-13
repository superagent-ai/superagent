"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useMountedState() {
    var mountedRef = react_1.useRef(false);
    var get = react_1.useCallback(function () { return mountedRef.current; }, []);
    react_1.useEffect(function () {
        mountedRef.current = true;
        return function () {
            mountedRef.current = false;
        };
    }, []);
    return get;
}
exports.default = useMountedState;
