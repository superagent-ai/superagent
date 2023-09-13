"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useMountedState_1 = tslib_1.__importDefault(require("./useMountedState"));
var useUpdate_1 = tslib_1.__importDefault(require("./useUpdate"));
var useUpdateEffect_1 = tslib_1.__importDefault(require("./useUpdateEffect"));
function useStateList(stateSet) {
    if (stateSet === void 0) { stateSet = []; }
    var isMounted = useMountedState_1.default();
    var update = useUpdate_1.default();
    var index = react_1.useRef(0);
    // If new state list is shorter that before - switch to the last element
    useUpdateEffect_1.default(function () {
        if (stateSet.length <= index.current) {
            index.current = stateSet.length - 1;
            update();
        }
    }, [stateSet.length]);
    var actions = react_1.useMemo(function () { return ({
        next: function () { return actions.setStateAt(index.current + 1); },
        prev: function () { return actions.setStateAt(index.current - 1); },
        setStateAt: function (newIndex) {
            // do nothing on unmounted component
            if (!isMounted())
                return;
            // do nothing on empty states list
            if (!stateSet.length)
                return;
            // in case new index is equal current - do nothing
            if (newIndex === index.current)
                return;
            // it gives the ability to travel through the left and right borders.
            // 4ex: if list contains 5 elements, attempt to set index 9 will bring use to 5th element
            // in case of negative index it will start counting from the right, so -17 will bring us to 4th element
            index.current =
                newIndex >= 0
                    ? newIndex % stateSet.length
                    : stateSet.length + (newIndex % stateSet.length);
            update();
        },
        setState: function (state) {
            // do nothing on unmounted component
            if (!isMounted())
                return;
            var newIndex = stateSet.length ? stateSet.indexOf(state) : -1;
            if (newIndex === -1) {
                throw new Error("State '" + state + "' is not a valid state (does not exist in state list)");
            }
            index.current = newIndex;
            update();
        },
    }); }, [stateSet]);
    return tslib_1.__assign({ state: stateSet[index.current], currentIndex: index.current }, actions);
}
exports.default = useStateList;
