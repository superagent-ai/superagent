import { useCallback } from 'react';
import useMountedState from './useMountedState';
var usePromise = function () {
    var isMounted = useMountedState();
    return useCallback(function (promise) {
        return new Promise(function (resolve, reject) {
            var onValue = function (value) {
                isMounted() && resolve(value);
            };
            var onError = function (error) {
                isMounted() && reject(error);
            };
            promise.then(onValue, onError);
        });
    }, []);
};
export default usePromise;
