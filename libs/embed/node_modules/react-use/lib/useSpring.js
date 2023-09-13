"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var rebound_1 = require("rebound");
var useSpring = function (targetValue, tension, friction) {
    if (targetValue === void 0) { targetValue = 0; }
    if (tension === void 0) { tension = 50; }
    if (friction === void 0) { friction = 3; }
    var _a = react_1.useState(null), spring = _a[0], setSpring = _a[1];
    var _b = react_1.useState(targetValue), value = _b[0], setValue = _b[1];
    // memoize listener to being able to unsubscribe later properly, otherwise
    // listener fn will be different on each re-render and wouldn't unsubscribe properly.
    var listener = react_1.useMemo(function () { return ({
        onSpringUpdate: function (currentSpring) {
            var newValue = currentSpring.getCurrentValue();
            setValue(newValue);
        },
    }); }, []);
    react_1.useEffect(function () {
        if (!spring) {
            var newSpring = new rebound_1.SpringSystem().createSpring(tension, friction);
            newSpring.setCurrentValue(targetValue);
            setSpring(newSpring);
            newSpring.addListener(listener);
        }
        return function () {
            if (spring) {
                spring.removeListener(listener);
                setSpring(null);
            }
        };
    }, [tension, friction, spring]);
    react_1.useEffect(function () {
        if (spring) {
            spring.setEndValue(targetValue);
        }
    }, [targetValue]);
    return value;
};
exports.default = useSpring;
