import { useState } from 'react';
var useDefault = function (defaultValue, initialValue) {
    var _a = useState(initialValue), value = _a[0], setValue = _a[1];
    if (value === undefined || value === null) {
        return [defaultValue, setValue];
    }
    return [value, setValue];
};
export default useDefault;
