"use strict";
/*
IE11 support
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirst = exports.asArray = exports.toArray = void 0;
var toArray = function (a) {
    var ret = Array(a.length);
    for (var i = 0; i < a.length; ++i) {
        ret[i] = a[i];
    }
    return ret;
};
exports.toArray = toArray;
var asArray = function (a) { return (Array.isArray(a) ? a : [a]); };
exports.asArray = asArray;
var getFirst = function (a) { return (Array.isArray(a) ? a[0] : a); };
exports.getFirst = getFirst;
