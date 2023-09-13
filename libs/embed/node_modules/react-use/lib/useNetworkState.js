"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var util_1 = require("./misc/util");
var nav = util_1.isNavigator ? navigator : undefined;
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
function useNetworkState(initialState) {
    var _a = react_1.useState(initialState !== null && initialState !== void 0 ? initialState : getConnectionState), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        var handleStateChange = function () {
            setState(getConnectionState);
        };
        util_1.on(window, 'online', handleStateChange, { passive: true });
        util_1.on(window, 'offline', handleStateChange, { passive: true });
        if (conn) {
            util_1.on(conn, 'change', handleStateChange, { passive: true });
        }
        return function () {
            util_1.off(window, 'online', handleStateChange);
            util_1.off(window, 'offline', handleStateChange);
            if (conn) {
                util_1.off(conn, 'change', handleStateChange);
            }
        };
    }, []);
    return state;
}
exports.default = useNetworkState;
