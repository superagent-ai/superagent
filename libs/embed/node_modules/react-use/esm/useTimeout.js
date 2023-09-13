import useTimeoutFn from './useTimeoutFn';
import useUpdate from './useUpdate';
export default function useTimeout(ms) {
    if (ms === void 0) { ms = 0; }
    var update = useUpdate();
    return useTimeoutFn(update, ms);
}
