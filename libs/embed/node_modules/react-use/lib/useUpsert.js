"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var useList_1 = tslib_1.__importDefault(require("./useList"));
/**
 * @deprecated Use `useList` hook's upsert action instead
 */
function useUpsert(predicate, initialList) {
    if (initialList === void 0) { initialList = []; }
    var _a = useList_1.default(initialList), list = _a[0], listActions = _a[1];
    return [
        list,
        tslib_1.__assign(tslib_1.__assign({}, listActions), { upsert: function (newItem) {
                listActions.upsert(predicate, newItem);
            } }),
    ];
}
exports.default = useUpsert;
