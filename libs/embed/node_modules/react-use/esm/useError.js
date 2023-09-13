import { useCallback, useEffect, useState } from 'react';
var useError = function () {
    var _a = useState(null), error = _a[0], setError = _a[1];
    useEffect(function () {
        if (error) {
            throw error;
        }
    }, [error]);
    var dispatchError = useCallback(function (err) {
        setError(err);
    }, []);
    return dispatchError;
};
export default useError;
