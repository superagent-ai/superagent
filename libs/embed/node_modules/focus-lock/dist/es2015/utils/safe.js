export var safeProbe = function (cb) {
    try {
        return cb();
    }
    catch (e) {
        return undefined;
    }
};
