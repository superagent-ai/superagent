import { __rest } from "tslib";
import useKey from '../useKey';
import createRenderProp from '../factory/createRenderProp';
var UseKey = createRenderProp(useKey, function (_a) {
    var filter = _a.filter, fn = _a.fn, deps = _a.deps, rest = __rest(_a, ["filter", "fn", "deps"]);
    return [
        filter,
        fn,
        rest,
        deps,
    ];
});
export default UseKey;
