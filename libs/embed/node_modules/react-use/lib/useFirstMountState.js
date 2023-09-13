"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFirstMountState = void 0;
var react_1 = require("react");
function useFirstMountState() {
    var isFirst = react_1.useRef(true);
    if (isFirst.current) {
        isFirst.current = false;
        return true;
    }
    return isFirst.current;
}
exports.useFirstMountState = useFirstMountState;
