/*
IE11 support
 */
export var toArray = function (a) {
    var ret = Array(a.length);
    for (var i = 0; i < a.length; ++i) {
        ret[i] = a[i];
    }
    return ret;
};
export var asArray = function (a) { return (Array.isArray(a) ? a : [a]); };
export var getFirst = function (a) { return (Array.isArray(a) ? a[0] : a); };
