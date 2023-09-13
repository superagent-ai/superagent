import { useEffect, useState } from 'react';
import { noop, off, on } from './misc/util';
// const usePermission = <T extends PermissionDescriptor>(permissionDesc: T): IState => {
var usePermission = function (permissionDesc) {
    var _a = useState(''), state = _a[0], setState = _a[1];
    useEffect(function () {
        var mounted = true;
        var permissionStatus = null;
        var onChange = function () {
            if (!mounted) {
                return;
            }
            setState(function () { var _a; return (_a = permissionStatus === null || permissionStatus === void 0 ? void 0 : permissionStatus.state) !== null && _a !== void 0 ? _a : ''; });
        };
        navigator.permissions
            .query(permissionDesc)
            .then(function (status) {
            permissionStatus = status;
            on(permissionStatus, 'change', onChange);
            onChange();
        })
            .catch(noop);
        return function () {
            permissionStatus && off(permissionStatus, 'change', onChange);
            mounted = false;
            permissionStatus = null;
        };
    }, [permissionDesc]);
    return state;
};
export default usePermission;
