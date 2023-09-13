"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var updateReducer = function (num) { return (num + 1) % 1000000; };
function useUpdate() {
    var _a = react_1.useReducer(updateReducer, 0), update = _a[1];
    return update;
}
exports.default = useUpdate;
