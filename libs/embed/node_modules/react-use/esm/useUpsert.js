import { __assign } from "tslib";
import useList from './useList';
/**
 * @deprecated Use `useList` hook's upsert action instead
 */
export default function useUpsert(predicate, initialList) {
    if (initialList === void 0) { initialList = []; }
    var _a = useList(initialList), list = _a[0], listActions = _a[1];
    return [
        list,
        __assign(__assign({}, listActions), { upsert: function (newItem) {
                listActions.upsert(predicate, newItem);
            } }),
    ];
}
