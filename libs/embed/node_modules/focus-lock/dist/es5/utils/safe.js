"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeProbe = void 0;
var safeProbe = function (cb) {
    try {
        return cb();
    }
    catch (e) {
        return undefined;
    }
};
exports.safeProbe = safeProbe;
