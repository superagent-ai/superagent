import { useEffect, useMemo, useState } from 'react';
import { SpringSystem } from 'rebound';
var useSpring = function (targetValue, tension, friction) {
    if (targetValue === void 0) { targetValue = 0; }
    if (tension === void 0) { tension = 50; }
    if (friction === void 0) { friction = 3; }
    var _a = useState(null), spring = _a[0], setSpring = _a[1];
    var _b = useState(targetValue), value = _b[0], setValue = _b[1];
    // memoize listener to being able to unsubscribe later properly, otherwise
    // listener fn will be different on each re-render and wouldn't unsubscribe properly.
    var listener = useMemo(function () { return ({
        onSpringUpdate: function (currentSpring) {
            var newValue = currentSpring.getCurrentValue();
            setValue(newValue);
        },
    }); }, []);
    useEffect(function () {
        if (!spring) {
            var newSpring = new SpringSystem().createSpring(tension, friction);
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
    useEffect(function () {
        if (spring) {
            spring.setEndValue(targetValue);
        }
    }, [targetValue]);
    return value;
};
export default useSpring;
