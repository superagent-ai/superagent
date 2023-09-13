"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var wrapInStatefulComponent = function (Comp) {
    var Decorated = (function (_super) {
        tslib_1.__extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.render = function () {
            return Comp(this.props, this.context);
        };
        return class_1;
    }(React.Component));
    if (process.env.NODE_ENV !== 'production') {
        Decorated.displayName = "Decorated(" + (Comp.displayName || Comp.name) + ")";
    }
    return Decorated;
};
exports.default = wrapInStatefulComponent;
//# sourceMappingURL=wrapInStatefulComponent.js.map