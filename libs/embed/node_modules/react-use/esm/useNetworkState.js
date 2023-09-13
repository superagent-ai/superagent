import { useEffect, useState } from 'react';
import { isNavigator, off, on } from './misc/util';
var nav = isNavigator ? navigator : undefined;
var conn = nav && (nav.connection || nav.mozConnection || nav.webkitConnection);
function getConnectionState(previousState) {
    var online = nav === null || nav === void 0 ? void 0 : nav.onLine;
    var previousOnline = previousState === null || previousState === void 0 ? void 0 : previousState.online;
    return {
        online: online,
        previous: previousOnline,
        since: online !== previousOnline ? new Date() : previousState === null || previousState === void 0 ? void 0 : previousState.since,
        downlink: conn === null || conn === void 0 ? void 0 : conn.downlink,
        downlinkMax: conn === null || conn === void 0 ? void 0 : conn.downlinkMax,
        effectiveType: conn === null || conn === void 0 ? void 0 : conn.effectiveType,
        rtt: conn === null || conn === void 0 ? void 0 : conn.rtt,
        saveData: conn === null || conn === void 0 ? void 0 : conn.saveData,
        type: conn === null || conn === void 0 ? void 0 : conn.type,
    };
}
export default function useNetworkState(initialState) {
    var _a = useState(initialState !== null && initialState !== void 0 ? initialState : getConnectionState), state = _a[0], setState = _a[1];
    useEffect(function () {
        var handleStateChange = function () {
            setState(getConnectionState);
        };
        on(window, 'online', handleStateChange, { passive: true });
        on(window, 'offline', handleStateChange, { passive: true });
        if (conn) {
            on(conn, 'change', handleStateChange, { passive: true });
        }
        return function () {
            off(window, 'online', handleStateChange);
            off(window, 'offline', handleStateChange);
            if (conn) {
                off(conn, 'change', handleStateChange);
            }
        };
    }, []);
    return state;
}
