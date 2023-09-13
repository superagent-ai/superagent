"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var useMount_1 = tslib_1.__importDefault(require("./useMount"));
var useKeyboardJs = function (combination) {
    var _a = react_1.useState([false, null]), state = _a[0], set = _a[1];
    var _b = react_1.useState(null), keyboardJs = _b[0], setKeyboardJs = _b[1];
    useMount_1.default(function () {
        Promise.resolve().then(function () { return tslib_1.__importStar(require('keyboardjs')); }).then(function (k) { return setKeyboardJs(k.default || k); });
    });
    react_1.useEffect(function () {
        if (!keyboardJs) {
            return;
        }
        var down = function (event) { return set([true, event]); };
        var up = function (event) { return set([false, event]); };
        keyboardJs.bind(combination, down, up, true);
        return function () {
            keyboardJs.unbind(combination, down, up);
        };
    }, [combination, keyboardJs]);
    return state;
};
exports.default = useKeyboardJs;
