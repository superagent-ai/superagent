export const safeProbe = (cb) => {
    try {
        return cb();
    }
    catch (e) {
        return undefined;
    }
};
