"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var render_1 = tslib_1.__importDefault(require("./render"));
var defaultMapPropsToArgs = function (props) { return [props]; };
var hookToRenderProp = function (hook, mapPropsToArgs) {
    if (mapPropsToArgs === void 0) { mapPropsToArgs = defaultMapPropsToArgs; }
    return function (props) { return render_1.default(props, hook.apply(void 0, mapPropsToArgs(props))); };
};
exports.default = hookToRenderProp;
//# sourceMappingURL=hookToRenderProp.js.map