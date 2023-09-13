let counter = 0;
const buckets = {};
const setHarmonicInterval = (fn, ms) => {
    const id = counter++;
    if (buckets[ms]) {
        buckets[ms].listeners[id] = fn;
    }
    else {
        const timer = setInterval(() => {
            const { listeners } = buckets[ms];
            let didThrow = false;
            let lastError;
            for (const listener of Object.values(listeners)) {
                try {
                    listener();
                }
                catch (error) {
                    didThrow = true;
                    lastError = error;
                }
            }
            if (didThrow)
                throw lastError;
        }, ms);
        buckets[ms] = {
            ms,
            timer,
            listeners: {
                [id]: fn,
            },
        };
    }
    return {
        bucket: buckets[ms],
        id,
    };
};
const clearHarmonicInterval = ({ bucket, id }) => {
    delete bucket.listeners[id];
    let hasListeners = false;
    for (const listener in bucket.listeners) {
        hasListeners = true;
        break;
    }
    if (!hasListeners) {
        clearInterval(bucket.timer);
        delete buckets[bucket.ms];
    }
};

export { clearHarmonicInterval, setHarmonicInterval };
