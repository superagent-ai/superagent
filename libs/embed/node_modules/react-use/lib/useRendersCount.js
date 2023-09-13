"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRendersCount = void 0;
var react_1 = require("react");
function useRendersCount() {
    return ++react_1.useRef(0).current;
}
exports.useRendersCount = useRendersCount;
