import { useEffect, useState } from 'react';
import { isNavigator, off, on } from './misc/util';
import isDeepEqual from './misc/isDeepEqual';
var nav = isNavigator ? navigator : undefined;
var isBatteryApiSupported = nav && typeof nav.getBattery === 'function';
function useBatteryMock() {
    return { isSupported: false };
}
function useBattery() {
    var _a = useState({ isSupported: true, fetched: false }), state = _a[0], setState = _a[1];
    useEffect(function () {
        var isMounted = true;
        var battery = null;
        var handleChange = function () {
            if (!isMounted || !battery) {
                return;
            }
            var newState = {
                isSupported: true,
                fetched: true,
                level: battery.level,
                charging: battery.charging,
                dischargingTime: battery.dischargingTime,
                chargingTime: battery.chargingTime,
            };
            !isDeepEqual(state, newState) && setState(newState);
        };
        nav.getBattery().then(function (bat) {
            if (!isMounted) {
                return;
            }
            battery = bat;
            on(battery, 'chargingchange', handleChange);
            on(battery, 'chargingtimechange', handleChange);
            on(battery, 'dischargingtimechange', handleChange);
            on(battery, 'levelchange', handleChange);
            handleChange();
        });
        return function () {
            isMounted = false;
            if (battery) {
                off(battery, 'chargingchange', handleChange);
                off(battery, 'chargingtimechange', handleChange);
                off(battery, 'dischargingtimechange', handleChange);
                off(battery, 'levelchange', handleChange);
            }
        };
    }, []);
    return state;
}
export default isBatteryApiSupported ? useBattery : useBatteryMock;
