"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var wrapInStatefulComponent_1 = tslib_1.__importDefault(require("./wrapInStatefulComponent"));
var addClassDecoratorSupport = function (Comp) {
    var isSFC = !Comp.prototype;
    return !isSFC ? Comp : wrapInStatefulComponent_1.default(Comp);
};
exports.default = addClassDecoratorSupport;
//# sourceMappingURL=addClassDecoratorSupport.js.map